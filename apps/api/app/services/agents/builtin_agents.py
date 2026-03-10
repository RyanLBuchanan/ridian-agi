from app.services.agents.base import AgentProfile, BaseAgent


class WorkspaceConciergeAgent(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            profile=AgentProfile(
                key="workspace_concierge",
                name="Workspace Concierge",
                purpose="Primary user-facing agent for warm communication, orientation, and top-level routing.",
                trigger_conditions=("help", "what should", "how do", "start", "guide"),
                preferred_tools=(),
                response_style="Warm, clear, elegant, and concise.",
            )
        )

    def match_score(self, user_message: str) -> int:
        score = super().match_score(user_message)
        if score == 0:
            return 1
        return score


class BuilderAgent(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            profile=AgentProfile(
                key="builder_agent",
                name="Builder Agent",
                purpose="Supports architecture questions, coding work, implementation planning, and systems thinking.",
                trigger_conditions=("build", "code", "implement", "refactor", "architecture", "system"),
                preferred_tools=("echo",),
                response_style="Structured, technical, and implementation-oriented.",
            )
        )


class ResearchAgent(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            profile=AgentProfile(
                key="research_agent",
                name="Research Agent",
                purpose="Organizes findings, synthesizes information, and supports exploratory thinking.",
                trigger_conditions=("research", "investigate", "compare", "find", "explore", "synthesize"),
                preferred_tools=(),
                response_style="Analytical, organized, and synthesis-focused.",
            )
        )


class MemoryCuratorAgent(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            profile=AgentProfile(
                key="memory_curator",
                name="Memory Curator",
                purpose="Applies memory discipline by deciding what should be stored and what context should be retrieved.",
                trigger_conditions=("remember", "memory", "store", "recall", "retrieve", "context"),
                preferred_tools=(),
                response_style="Deliberate, selective, and context-aware.",
            )
        )


class VerificationAgent(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            profile=AgentProfile(
                key="verification_agent",
                name="Verification Agent",
                purpose="Inspects outputs for completeness, consistency, structure, and obvious quality issues.",
                trigger_conditions=("verify", "review", "check", "confirm", "validate", "quality"),
                preferred_tools=(),
                response_style="Careful, skeptical, and quality-oriented.",
            )
        )


def get_builtin_agents() -> tuple[BaseAgent, ...]:
    """Return the first disciplined agent set for Little Ridian AGI."""

    return (
        WorkspaceConciergeAgent(),
        BuilderAgent(),
        ResearchAgent(),
        MemoryCuratorAgent(),
        VerificationAgent(),
    )
