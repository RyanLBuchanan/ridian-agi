from typing import Protocol

from app.domain.schemas.memory import MemoryEntry, MemoryItem, MemoryQuery, MemoryWriteRequest, MemoryWriteResult
from app.services.memory.policy import MemoryWritePolicy
from app.services.memory.repositories import InMemoryMemoryRepository, MemoryRepository


class MemoryProvider(Protocol):
    """Interface for disciplined memory storage and retrieval."""

    def write(self, request: MemoryWriteRequest) -> MemoryWriteResult:
        raise NotImplementedError

    def recall(self, query: str, limit: int = 5) -> list[MemoryEntry]:
        raise NotImplementedError


class DisciplinedMemoryService:
    """First practical memory layer for Little Ridian AGI.

    Supports session memory, project memory, user preference memory, and
    task/episode memory with simple write discipline and ranked retrieval.

    TODO: Add summarization before storing longer task and episode memories.
    TODO: Add memory compression and consolidation for older low-importance items.
    """

    def __init__(self, repository: MemoryRepository | None = None, policy: MemoryWritePolicy | None = None) -> None:
        self.repository = repository or InMemoryMemoryRepository()
        self.policy = policy or MemoryWritePolicy()

    def write(self, request: MemoryWriteRequest) -> MemoryWriteResult:
        decision = self.policy.evaluate(request)
        if not decision.should_store:
            return MemoryWriteResult(stored=False, reason=decision.reason)

        normalized_request = request.model_copy(
            update={
                "metadata": request.metadata.model_copy(
                    update={"tags": self._merged_tags(request.metadata.tags, decision.normalized_tags)}
                )
            }
        )
        record = self.repository.save(normalized_request)
        return MemoryWriteResult(stored=True, reason=decision.reason, record=record)

    def recall(self, query: str, limit: int = 5) -> list[MemoryEntry]:
        # TODO: Blend keyword ranking with semantic retrieval once embeddings are introduced.
        return self.repository.search(MemoryQuery(text=query, limit=limit))

    def retrieve_session_memory(self, query: str, session_id: str, limit: int = 5) -> list[MemoryEntry]:
        return self.repository.search(
            MemoryQuery(text=query, memory_types=["session"], session_id=session_id, limit=limit)
        )

    def retrieve_project_memory(self, query: str, project_key: str, limit: int = 5) -> list[MemoryEntry]:
        return self.repository.search(
            MemoryQuery(text=query, memory_types=["project"], project_key=project_key, limit=limit)
        )

    def retrieve_user_preferences(self, query: str = "preference", limit: int = 5) -> list[MemoryEntry]:
        return self.repository.search(
            MemoryQuery(text=query, memory_types=["user_preference"], limit=limit)
        )

    def retrieve_episode_memory(self, query: str, task_id: str | None = None, limit: int = 5) -> list[MemoryEntry]:
        return self.repository.search(
            MemoryQuery(text=query, memory_types=["episode"], task_id=task_id, limit=limit)
        )

    def remember(self, key: str, value: str, scope: str = "session") -> MemoryWriteResult:
        """Compatibility helper retained for existing orchestrator call sites."""

        memory_type = scope if scope in {"session", "project", "user_preference", "episode"} else "session"
        return self.write(
            MemoryWriteRequest(
                memory_type=memory_type,
                key=key,
                content=value,
            )
        )

    def remember_episode(self, task_id: str, key: str, content: str, summary: str | None = None) -> MemoryWriteResult:
        return self.write(
            MemoryWriteRequest(
                memory_type="episode",
                key=key,
                content=content,
                summary=summary,
                metadata={"task_id": task_id, "source": "orchestrator", "tags": ["episode"]},
            )
        )

    def remember_project_fact(self, key: str, content: str, project_key: str) -> MemoryWriteResult:
        return self.write(
            MemoryWriteRequest(
                memory_type="project",
                key=key,
                content=content,
                metadata={"project_key": project_key, "source": "project_context", "tags": ["project"]},
            )
        )

    def remember_user_preference(self, key: str, content: str) -> MemoryWriteResult:
        return self.write(
            MemoryWriteRequest(
                memory_type="user_preference",
                key=key,
                content=content,
                metadata={"source": "user_preference", "tags": ["preference"], "importance": 3},
            )
        )

    def to_compatibility_items(self, entries: list[MemoryEntry]) -> list[MemoryItem]:
        return [MemoryItem(key=entry.key, value=entry.content, scope=entry.memory_type) for entry in entries]

    def _merged_tags(self, existing_tags: list[str], normalized_tags: list[str]) -> list[str]:
        merged = list(dict.fromkeys([*existing_tags, *normalized_tags]))
        return merged


MemoryService = DisciplinedMemoryService
