from app.domain.schemas.chat import ExecutionMode
from app.domain.schemas.task import TaskPlan


class TaskPlanner:
    """Generates a small explicit plan so orchestration remains inspectable."""

    def make_plan(self, message: str, execution_mode: ExecutionMode) -> TaskPlan:
        # TODO: Replace rule-based planning with model-guided decomposition when needed.
        del message
        steps = ["receive_input", "check_permissions", "recall_memory"]
        if execution_mode == "retrieval_assisted":
            steps.append("retrieve_context")
        if execution_mode == "tool_consideration":
            steps.append("consider_tools")
        if execution_mode == "delegated_agent":
            steps.append("select_agent")
        steps.extend(["route_model", "draft_response", "verify_response", "assemble_response"])
        return TaskPlan(steps=steps)
