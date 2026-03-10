import logging

from app.domain.schemas.chat import ChatRequest, ChatResponse, ExecutionMode
from app.services.agents.registry import AgentRegistry, AgentSelection
from app.services.memory.memory_service import DisciplinedMemoryService
from app.services.model_router.router import ModelRouter
from app.services.orchestrator.execution_runtime import ExecutionRuntime
from app.services.orchestrator.task_planner import TaskPlanner
from app.services.permissions.checker import PermissionsChecker
from app.services.retrieval.retrieval_service import RetrievalHit, RetrievalProvider
from app.services.tools.registry import ToolCandidate, ToolRegistry
from app.services.tracing.trace_service import TaskTrace, TaskTraceLogger
from app.services.verification.verifier import Verifier

logger = logging.getLogger(__name__)


class Orchestrator:
    """Core orchestration spine for chat requests.

    Flow:
    1. create a run trace
    2. check permissions
    3. decide execution mode
    4. consult the agent registry for the best-fit agent profile
    5. gather memory/retrieval/tool context as needed
    6. route the model request
    7. verify the result
    8. assemble a stable API response
    """

    def __init__(self) -> None:
        """Wire the current provider and registry dependencies for chat orchestration."""

        self.trace_logger = TaskTraceLogger()
        self.permissions = PermissionsChecker()
        self.planner = TaskPlanner()
        self.runtime = ExecutionRuntime()
        self.model_router = ModelRouter()
        self.memory = DisciplinedMemoryService()
        self.retrieval = RetrievalProvider()
        self.tools = ToolRegistry()
        self.agents = AgentRegistry()
        self.verifier = Verifier()

    def handle_chat(self, request: ChatRequest) -> ChatResponse:
        """Coordinate one chat turn and return a stable structured response."""

        trace = self.trace_logger.start_run()
        self.trace_logger.add_step(trace, "input_received", f"chars={len(request.message)}")

        permission = self.permissions.check("chat:respond")
        self.trace_logger.add_step(trace, "permissions_checked", permission.reason)
        if not permission.allowed:
            return self._build_response(
                trace=trace,
                response_text="Permission denied.",
                execution_mode="direct_response",
                selected_agent=None,
            )

        execution_mode = self._select_execution_mode(request.message)
        self.trace_logger.add_step(trace, "execution_mode_selected", execution_mode)

        consulted_agent = self.agents.select_for_message(request.message, execution_mode)
        self.trace_logger.add_step(trace, "agent_consulted", consulted_agent.name)

        plan = self.planner.make_plan(request.message, execution_mode)
        self.trace_logger.add_step(trace, "plan_built", self.runtime.summarize(plan.steps))

        related_memory = self.memory.recall(request.message)
        self.trace_logger.add_step(trace, "memory_recalled", f"count={len(related_memory)}")

        retrieval_hits = self._retrieve_if_needed(request.message, execution_mode, trace)
        tool_candidates = self._consider_tools_if_needed(request.message, execution_mode, trace)
        agent_selection = self._select_agent_for_execution(consulted_agent, execution_mode, trace)

        prompt = self._build_prompt(
            user_message=request.message,
            execution_mode=execution_mode,
            memory_count=len(related_memory),
            retrieval_hits=retrieval_hits,
            tool_candidates=tool_candidates,
            agent_selection=agent_selection,
        )
        model_result = self.model_router.generate(prompt=prompt, execution_mode=execution_mode)
        self.trace_logger.add_step(
            trace,
            "model_completed",
            f"provider={model_result.provider_name} model={model_result.model_name}",
        )

        verification = self.verifier.verify_response(model_result.text)
        self.trace_logger.add_step(trace, "response_verified", verification.status)

        # TODO: Add a second-pass verifier for tool-backed or high-impact responses.

        memory_write = self.memory.remember_episode(
            task_id=trace.run_id,
            key="user_request",
            content=f"User asked: {request.message}",
            summary="Latest user request for this orchestration run.",
        )
        self.trace_logger.add_step(trace, "memory_updated", memory_write.reason)

        logger.info(
            "orchestration_complete run_id=%s mode=%s selected_agent=%s verified=%s",
            trace.run_id,
            execution_mode,
            agent_selection.name if agent_selection else "none",
            verification.verified,
        )
        return self._build_response(
            trace=trace,
            response_text=verification.final_text,
            execution_mode=execution_mode,
            selected_agent=agent_selection.name if agent_selection else None,
        )

    def _select_execution_mode(self, user_message: str) -> ExecutionMode:
        """Select a single execution mode using explicit keyword heuristics."""

        normalized = user_message.lower()
        if self.verifier.should_verify(user_message):
            return "verify_before_return"
        if any(keyword in normalized for keyword in ["delegate", "agent", "research", "build", "implement"]):
            return "delegated_agent"
        if any(keyword in normalized for keyword in ["tool", "run", "execute", "command"]):
            return "tool_consideration"
        if any(keyword in normalized for keyword in ["find", "lookup", "recall", "search", "context"]):
            return "retrieval_assisted"
        return "direct_response"

    def _retrieve_if_needed(
        self,
        user_message: str,
        execution_mode: ExecutionMode,
        trace: TaskTrace,
    ) -> list[RetrievalHit]:
        if execution_mode != "retrieval_assisted":
            return []
        hits = self.retrieval.retrieve(user_message)
        self.trace_logger.add_step(trace, "retrieval_completed", f"count={len(hits)}")
        return hits

    def _consider_tools_if_needed(
        self,
        user_message: str,
        execution_mode: ExecutionMode,
        trace: TaskTrace,
    ) -> list[ToolCandidate]:
        if execution_mode != "tool_consideration":
            return []
        candidates = self.tools.consider(
            user_message,
            self.permissions,
            actor="orchestrator",
            run_id=trace.run_id,
        )
        allowed_count = sum(1 for candidate in candidates if candidate.allowed)
        self.trace_logger.add_step(
            trace,
            "tools_considered",
            f"count={len(candidates)} allowed={allowed_count}",
        )
        return candidates

    def _select_agent_for_execution(
        self,
        consulted_agent: AgentSelection,
        execution_mode: ExecutionMode,
        trace: TaskTrace,
    ) -> AgentSelection | None:
        if execution_mode == "direct_response":
            return consulted_agent

        if execution_mode not in {
            "delegated_agent",
            "retrieval_assisted",
            "tool_consideration",
            "verify_before_return",
        }:
            return None

        self.trace_logger.add_step(
            trace,
            "agent_selected",
            consulted_agent.name,
        )
        return consulted_agent

    def _build_prompt(
        self,
        user_message: str,
        execution_mode: ExecutionMode,
        memory_count: int,
        retrieval_hits: list[RetrievalHit],
        tool_candidates: list[ToolCandidate],
        agent_selection: AgentSelection | None,
    ) -> str:
        # TODO: Move to prompt templates with stronger system role instructions.
        # TODO: Split user-facing prompting from internal orchestration annotations.
        retrieval_text = "\n".join(hit.content for hit in retrieval_hits) if retrieval_hits else "No retrieved context."
        tool_text = (
            ", ".join(
                f"{candidate.name}[{'allowed' if candidate.allowed else candidate.decision_reason}]"
                for candidate in tool_candidates
            )
            if tool_candidates
            else "No tools considered."
        )
        agent_text = agent_selection.name if agent_selection else "No delegated agent."
        return (
            "You are Little Ridian AGI, a calm and practical workspace intelligence assistant.\n"
            f"Execution mode: {execution_mode}.\n"
            f"Selected specialist agent: {agent_text}.\n"
            f"Agent purpose: {agent_selection.purpose if agent_selection else 'General workspace interaction.'}.\n"
            f"Agent response style: {agent_selection.response_style if agent_selection else 'Calm and clear.'}.\n"
            f"Memory hits: {memory_count}.\n"
            f"Retrieved context:\n{retrieval_text}\n"
            f"Tool consideration: {tool_text}.\n"
            "User message:\n"
            f"{user_message}"
        )

    def _build_response(
        self,
        trace: TaskTrace,
        response_text: str,
        execution_mode: ExecutionMode,
        selected_agent: str | None,
    ) -> ChatResponse:
        """Assemble the stable backend chat contract returned by the route."""

        return ChatResponse(
            run_id=trace.run_id,
            response=response_text,
            execution_mode=execution_mode,
            selected_agent=selected_agent,
            trace_summary=self.trace_logger.summarize(trace),
            trace=self.trace_logger.public_steps(trace),
        )


# TODO: Remove compatibility alias after all imports use Orchestrator directly.
OrchestratorService = Orchestrator
