from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


PlanStepStatus = Literal["next", "ready", "later"]


class TaskPlanStep(BaseModel):
    title: str
    detail: str
    status: PlanStepStatus = "ready"

    model_config = ConfigDict(extra="forbid")


class TaskPlan(BaseModel):
    title: str | None = None
    summary: str | None = None
    steps: list[str]
    structured_steps: list[TaskPlanStep] = Field(default_factory=list, alias="structuredSteps")

    model_config = ConfigDict(populate_by_name=True, extra="forbid")
