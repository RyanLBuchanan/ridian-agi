from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterable
from datetime import datetime, timezone
from uuid import uuid4

from app.domain.schemas.memory import MemoryEntry, MemoryMetadata, MemoryQuery, MemoryWriteRequest

_MEMORY_STORE: list[MemoryEntry] = []


class MemoryRepository(ABC):
    """Persistence abstraction for the disciplined memory layer."""

    @abstractmethod
    def save(self, request: MemoryWriteRequest) -> MemoryEntry:
        raise NotImplementedError

    @abstractmethod
    def search(self, query: MemoryQuery) -> list[MemoryEntry]:
        raise NotImplementedError


class InMemoryMemoryRepository(MemoryRepository):
    """Process-local repository used until a SQLAlchemy-backed store is added.

    TODO: Replace this implementation with a real Postgres-backed repository
    that writes and reads `MemoryRecord` rows.
    TODO: Add deduplication and compaction once memory volume grows.
    """

    def save(self, request: MemoryWriteRequest) -> MemoryEntry:
        now = datetime.now(timezone.utc)
        record = MemoryEntry(
            id=str(uuid4()),
            memory_type=request.memory_type,
            key=request.key,
            content=request.content,
            summary=request.summary,
            metadata=MemoryMetadata(**request.metadata.model_dump()),
            created_at=now,
            updated_at=now,
        )
        _MEMORY_STORE.append(record)
        return record

    def search(self, query: MemoryQuery) -> list[MemoryEntry]:
        ranked: list[MemoryEntry] = []
        for item in self._filtered_items(query):
            score = self._score_item(item, query)
            if score <= 0:
                continue
            ranked.append(item.model_copy(update={"relevance_score": round(score, 3)}))

        ranked.sort(
            key=lambda item: (item.relevance_score or 0.0, item.metadata.importance, item.created_at or datetime.min.replace(tzinfo=timezone.utc)),
            reverse=True,
        )
        return ranked[: query.limit]

    def _filtered_items(self, query: MemoryQuery) -> Iterable[MemoryEntry]:
        for item in _MEMORY_STORE:
            if query.memory_types and item.memory_type not in query.memory_types:
                continue
            if item.metadata.user_id != query.user_id:
                continue
            if query.session_id and item.metadata.session_id not in {query.session_id, None}:
                continue
            if query.project_key and item.metadata.project_key not in {query.project_key, None}:
                continue
            if query.task_id and item.metadata.task_id not in {query.task_id, None}:
                continue
            yield item

    def _score_item(self, item: MemoryEntry, query: MemoryQuery) -> float:
        query_terms = self._tokenize(query.text)
        if not query_terms:
            return 0.0

        haystack = " ".join(
            [
                item.key.lower(),
                item.content.lower(),
                item.summary.lower() if item.summary else "",
                " ".join(item.metadata.tags).lower(),
            ]
        )

        score = 0.0
        hits = sum(1 for term in query_terms if term in haystack)
        score += hits * 2.0

        if any(term in item.key.lower() for term in query_terms):
            score += 1.5
        if item.memory_type == "user_preference":
            score += 0.75
        score += item.metadata.importance * 0.5
        score += self._recency_bonus(item)
        return score

    def _tokenize(self, text: str) -> list[str]:
        raw_terms = [part.strip().lower() for part in text.replace("/", " ").replace("_", " ").split()]
        return [term for term in raw_terms if len(term) > 2]

    def _recency_bonus(self, item: MemoryEntry) -> float:
        if item.created_at is None:
            return 0.0
        age_seconds = (datetime.now(timezone.utc) - item.created_at).total_seconds()
        if age_seconds < 3600:
            return 1.0
        if age_seconds < 86400:
            return 0.6
        if age_seconds < 604800:
            return 0.25
        return 0.0
