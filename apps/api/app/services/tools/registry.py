from dataclasses import dataclass
from collections.abc import Callable

from app.services.tools.builtin_tools import BUILTIN_TOOLS

ToolHandler = Callable[[dict[str, object]], dict[str, object]]


@dataclass(frozen=True)
class ToolCandidate:
    """Tool the orchestrator may consider without executing automatically."""

    name: str
    rationale: str


class ToolRegistry:
    """Registry for known tools and deterministic tool consideration."""

    def __init__(self) -> None:
        self._tools: dict[str, ToolHandler] = BUILTIN_TOOLS

    def list_tools(self) -> list[str]:
        return list(self._tools.keys())

    def consider(self, user_message: str) -> list[ToolCandidate]:
        # TODO: Replace keyword heuristics with structured intent-to-tool planning.
        normalized = user_message.lower()
        if any(keyword in normalized for keyword in ["tool", "run", "execute", "command"]):
            return [
                ToolCandidate(
                    name="echo",
                    rationale="Tool execution was requested, so the baseline tool registry was consulted.",
                )
            ]
        return []

    def execute(self, name: str, payload: dict[str, object]) -> dict[str, object]:
        # TODO: Add strict schema validation, permission checks, and sandboxing per tool.
        handler = self._tools.get(name)
        if handler is None:
            return {"error": f"tool_not_found:{name}"}
        return handler(payload)
