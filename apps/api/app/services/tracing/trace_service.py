from dataclasses import dataclass, field
from uuid import uuid4


@dataclass
class TraceStep:
    """Single public execution step recorded by the orchestrator."""

    name: str
    detail: str = ""


@dataclass
class TaskTrace:
    """Mutable trace container for one orchestrator run."""

    run_id: str
    steps: list[TraceStep] = field(default_factory=list)


class TaskTraceLogger:
    """Collects execution steps and returns a compact public trace for the API."""

    def start_run(self) -> TaskTrace:
        trace = TaskTrace(run_id=str(uuid4()))
        self.add_step(trace, "run_started", "Chat orchestration started.")
        return trace

    def add_step(self, trace: TaskTrace, name: str, detail: str = "") -> None:
        trace.steps.append(TraceStep(name=name, detail=detail))

    def add_event(self, trace: TaskTrace, event: str) -> None:
        self.add_step(trace, event)

    def summarize(self, trace: TaskTrace) -> str:
        return " -> ".join(step.name for step in trace.steps)

    def public_steps(self, trace: TaskTrace) -> list[str]:
        """Flatten the trace into stable string entries for the API response."""

        formatted_steps: list[str] = []
        for step in trace.steps:
            if step.detail:
                formatted_steps.append(f"{step.name}:{step.detail}")
            else:
                formatted_steps.append(step.name)
        return formatted_steps


TraceService = TaskTraceLogger
