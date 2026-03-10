from collections.abc import Iterable

from app.domain.schemas.memory import MemoryItem
from app.services.memory.repositories import MemoryRepository

_MEMORY_CACHE: list[MemoryItem] = []


class MemoryProvider:
    """Small in-process memory provider with a repository seam for later persistence."""

    def __init__(self) -> None:
        self.repo = MemoryRepository()

    def remember(self, key: str, value: str, scope: str = "workspace") -> None:
        # TODO: Replace process-local cache behavior with durable storage-backed memory writes.
        item = MemoryItem(key=key, value=value, scope=scope)
        _MEMORY_CACHE.append(item)
        self.repo.save(item)

    def recall(self, query: str) -> list[MemoryItem]:
        """Return lightweight keyword-matched memory items for the current process."""

        cached = list(self._match_cache(query))
        stored = self.repo.search(query)
        if stored:
            return cached + stored
        return cached

    def _match_cache(self, query: str) -> Iterable[MemoryItem]:
        normalized_query = query.lower()
        for item in reversed(_MEMORY_CACHE):
            if normalized_query in item.key.lower() or normalized_query in item.value.lower():
                yield item


MemoryService = MemoryProvider
