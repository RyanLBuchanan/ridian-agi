from dataclasses import dataclass

from app.domain.schemas.chat import ExecutionMode
from app.services.agents.base import AgentDefinition, AgentProfile
from app.services.agents.builtin_agents import get_builtin_agents


@dataclass(frozen=True)
class AgentSelection:
    """Agent selected for delegated handling of a request."""

    key: str
    name: str
    purpose: str
    response_style: str
    preferred_tools: tuple[str, ...]
    rationale: str


class AgentRegistry:
    """Registry for the first disciplined Little Ridian AGI agents.

    Selection remains deterministic and inspectable. The registry does not try
    to emulate autonomous agent behavior; it simply chooses the best-fit agent
    profile for the current message and execution mode.
    """

    def __init__(self) -> None:
        self._agents: tuple[AgentDefinition, ...] = get_builtin_agents()

    def list_agents(self) -> list[AgentProfile]:
        return [agent.profile for agent in self._agents]

    def get_agent(self, agent_key: str) -> AgentProfile | None:
        for agent in self._agents:
            if agent.profile.key == agent_key:
                return agent.profile
        return None

    def select_for_message(
        self,
        user_message: str,
        execution_mode: ExecutionMode,
    ) -> AgentSelection:
        """Select the best-fit agent using simple rule-based scoring.

        TODO: Introduce richer routing inputs such as task class, memory policy,
        and tool availability once the orchestrator needs them.
        """

        scored_agents: list[tuple[int, AgentDefinition]] = []
        for agent in self._agents:
            score = agent.match_score(user_message)
            score += self._mode_bonus(agent.profile.key, execution_mode)
            scored_agents.append((score, agent))

        scored_agents.sort(key=lambda item: item[0], reverse=True)
        best_score, best_agent = scored_agents[0]

        rationale = self._build_rationale(best_agent.profile, execution_mode, best_score)
        return AgentSelection(
            key=best_agent.profile.key,
            name=best_agent.profile.name,
            purpose=best_agent.profile.purpose,
            response_style=best_agent.profile.response_style,
            preferred_tools=best_agent.profile.preferred_tools,
            rationale=rationale,
        )

    def _mode_bonus(self, agent_key: str, execution_mode: ExecutionMode) -> int:
        if execution_mode == "direct_response" and agent_key == "workspace_concierge":
            return 3
        if execution_mode == "delegated_agent" and agent_key == "builder_agent":
            return 2
        if execution_mode == "retrieval_assisted" and agent_key == "research_agent":
            return 2
        if execution_mode == "verify_before_return" and agent_key == "verification_agent":
            return 3
        if execution_mode == "tool_consideration" and agent_key == "builder_agent":
            return 1
        if execution_mode == "retrieval_assisted" and agent_key == "memory_curator":
            return 1
        return 0

    def _build_rationale(
        self,
        profile: AgentProfile,
        execution_mode: ExecutionMode,
        score: int,
    ) -> str:
        return (
            f"Selected {profile.name} for mode={execution_mode} "
            f"with score={score} based on trigger conditions and routing bias."
        )

    def pick_for_task(self, task_type: str) -> str:
        """Compatibility helper kept for existing non-chat call sites."""

        # TODO: Remove once all callers use select_for_message or a richer selection contract.
        if task_type == "build":
            return "builder_agent"
        if task_type == "research":
            return "research_agent"
        return "workspace_concierge"
