from app.domain.schemas.chat import ExecutionMode
from app.domain.schemas.task import TaskPlan, TaskPlanStep


class TaskPlanner:
    """Generates a small explicit plan so orchestration remains inspectable."""

    def make_plan(
        self,
        message: str,
        execution_mode: ExecutionMode,
        selected_agent_key: str | None = None,
    ) -> TaskPlan:
        # TODO: Replace rule-based planning with model-guided decomposition when needed.
        steps = ["receive_input", "check_permissions", "recall_memory"]
        if execution_mode == "retrieval_assisted":
            steps.append("retrieve_context")
        if execution_mode == "tool_consideration":
            steps.append("consider_tools")
        if execution_mode == "delegated_agent":
            steps.append("select_agent")
        steps.extend(["route_model", "draft_response", "verify_response", "assemble_response"])

        if self._is_builder_request(message, execution_mode, selected_agent_key):
            return TaskPlan(
                title="Builder planning pass",
                summary="A small implementation-oriented plan was prepared for this builder-style request.",
                steps=steps,
                structured_steps=self._make_builder_steps(message),
            )

        return TaskPlan(steps=steps)

    def _is_builder_request(
        self,
        message: str,
        execution_mode: ExecutionMode,
        selected_agent_key: str | None,
    ) -> bool:
        if selected_agent_key == "builder_agent":
            return True

        if execution_mode != "delegated_agent":
            return False

        normalized = message.lower()
        return any(
            keyword in normalized
            for keyword in ["build", "builder", "plan", "implement", "create", "scaffold", "refactor"]
        )

    def _make_builder_steps(self, message: str) -> list[TaskPlanStep]:
        request_summary = " ".join(message.strip().split())
        if len(request_summary) > 120:
            request_summary = f"{request_summary[:117]}..."

        return [
            TaskPlanStep(
                title="Frame the target outcome",
                detail=f"Clarify the intended build result and keep the first slice narrow: {request_summary}",
                status="next",
            ),
            TaskPlanStep(
                title="Map the affected surfaces",
                detail="Identify the frontend, backend, orchestration, or data seams that the change will touch.",
                status="ready",
            ),
            TaskPlanStep(
                title="Implement the smallest viable slice",
                detail="Make the demo-worthy version first, preserving architecture and leaving clear seams for later expansion.",
                status="ready",
            ),
            TaskPlanStep(
                title="Verify and narrate the result",
                detail="Check the visible behavior, capture the execution posture, and summarize what remains placeholder versus real.",
                status="later",
            ),
        ]
