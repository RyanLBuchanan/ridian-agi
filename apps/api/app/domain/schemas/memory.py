from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

MemoryType = Literal["session", "project", "user_preference", "episode"]


class MemoryMetadata(BaseModel):
    """Structured ownership and indexing metadata for a memory entry."""

    user_id: str = "single-user"
    session_id: str | None = None
    project_key: str | None = None
    task_id: str | None = None
    source: str = "orchestrator"
    tags: list[str] = Field(default_factory=list)
    importance: int = Field(default=1, ge=1, le=5)


class MemoryEntry(BaseModel):
    """Application-level memory record used by services and repositories."""

    id: str | None = None
    memory_type: MemoryType
    key: str
    content: str
    summary: str | None = None
    metadata: MemoryMetadata = Field(default_factory=MemoryMetadata)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    relevance_score: float | None = None

    model_config = ConfigDict(populate_by_name=True)


class MemoryWriteRequest(BaseModel):
    """Incoming memory write candidate before policy evaluation."""

    memory_type: MemoryType
    key: str = Field(min_length=1, max_length=128)
    content: str = Field(min_length=1, max_length=12000)
    summary: str | None = None
    metadata: MemoryMetadata = Field(default_factory=MemoryMetadata)


class MemoryWriteDecision(BaseModel):
    """Result of memory policy evaluation."""

    should_store: bool
    reason: str
    normalized_tags: list[str] = Field(default_factory=list)


class MemoryWriteResult(BaseModel):
    """Outcome of a write attempt after policy and persistence."""

    stored: bool
    reason: str
    record: MemoryEntry | None = None


class MemoryQuery(BaseModel):
    """Memory retrieval request used for keyword-based ranking."""

    text: str = Field(min_length=1, max_length=4000)
    memory_types: list[MemoryType] | None = None
    limit: int = Field(default=5, ge=1, le=25)
    user_id: str = "single-user"
    session_id: str | None = None
    project_key: str | None = None
    task_id: str | None = None


class MemoryItem(BaseModel):
    """Compatibility shape retained for older call sites."""

    key: str
    value: str
    scope: MemoryType = "session"
