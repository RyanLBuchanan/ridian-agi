from dataclasses import dataclass

from app.services.agents.builtin_agents import BUILTIN_AGENTS


@dataclass(frozen=True)
class AgentSelection:
    """Agent selected for delegated handling of a request."""

    name: str
    rationale: str


class AgentRegistry:
    """Lightweight capability-based agent selection for delegated work."""

    def list_agents(self) -> dict[str, dict[str, object]]:
        return BUILTIN_AGENTS

    def select_for_message(self, user_message: str) -> AgentSelection | None:
        # TODO: Use capabilities, confidence, and cost constraints for routing.
        normalized = user_message.lower()
        if any(keyword in normalized for keyword in ["build", "code", "implement", "refactor"]):
            return AgentSelection(name="builder", rationale="Message suggests implementation-oriented work.")
        if any(keyword in normalized for keyword in ["research", "investigate", "compare", "find"]):
            return AgentSelection(name="researcher", rationale="Message suggests context gathering or comparison.")
        if any(keyword in normalized for keyword in ["plan", "design", "architecture", "decompose"]):
            return AgentSelection(name="architect", rationale="Message suggests planning or structural design.")
        return None

    def pick_for_task(self, task_type: str) -> str:
        """Compatibility helper kept for existing non-chat call sites."""

        # TODO: Remove once all callers use select_for_message or a richer selection contract.
        if task_type == "build":
            return "builder"
        if task_type == "research":
            return "researcher"
        return "architect"
