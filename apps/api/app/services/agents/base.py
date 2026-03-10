from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class AgentProfile:
    """Public metadata describing an agent's role and operating style."""

    key: str
    name: str
    purpose: str
    trigger_conditions: tuple[str, ...]
    preferred_tools: tuple[str, ...]
    response_style: str


class AgentDefinition(Protocol):
    """Minimal interface for registry-managed agents.

    Agents provide metadata and a simple scoring hook so the registry can make
    disciplined, explainable routing decisions without pretending there is a
    deeper autonomous system in place yet.
    """

    profile: AgentProfile

    def match_score(self, user_message: str) -> int:
        """Return a small deterministic score for the current request."""


@dataclass(frozen=True)
class BaseAgent:
    """Convenience base class for simple keyword-scored agents."""

    profile: AgentProfile

    def match_score(self, user_message: str) -> int:
        normalized = user_message.lower()
        score = 0
        for trigger in self.profile.trigger_conditions:
            if trigger in normalized:
                score += 1
        return score