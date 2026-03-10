from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.domain.schemas.task import TaskPlan

ExecutionMode = Literal[
    "direct_response",
    "retrieval_assisted",
    "tool_consideration",
    "delegated_agent",
    "verify_before_return",
]


class ChatRequest(BaseModel):
    """Single-turn chat input for the v1 orchestrator."""

    message: str = Field(min_length=1, max_length=12000, description="User-facing input message.")


class ChatResponse(BaseModel):
    """Stable chat response contract for the frontend alignment step.

    Public field names are intentionally camelCase at the API boundary:
    - runId
    - response
    - executionMode
    - selectedAgent
    - traceSummary
    - trace
    - plan
    """

    run_id: str = Field(alias="runId", description="Unique run identifier for the orchestration cycle.")
    response: str = Field(description="Final user-facing response message.")
    execution_mode: ExecutionMode = Field(alias="executionMode", description="Execution mode selected by the orchestrator.")
    selected_agent: str | None = Field(default=None, alias="selectedAgent", description="Selected specialist agent when delegation is used.")
    trace_summary: str = Field(alias="traceSummary", description="Compact summary of execution steps.")
    trace: list[str] = Field(description="Ordered public execution trace entries.")
    plan: TaskPlan | None = Field(default=None, description="Optional structured plan preview for planning-oriented runs.")

    model_config = ConfigDict(populate_by_name=True, extra="forbid")
