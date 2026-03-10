from pydantic import BaseModel


class MemoryItem(BaseModel):
    key: str
    value: str
    scope: str = "workspace"
