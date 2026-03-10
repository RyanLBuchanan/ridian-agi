from pydantic import BaseModel


class TaskPlan(BaseModel):
    steps: list[str]
