from app.domain.schemas.memory import MemoryItem


class MemoryRepository:
    def save(self, item: MemoryItem) -> None:
        # TODO: Persist to Postgres using SQLAlchemy session.
        del item

    def search(self, query: str) -> list[MemoryItem]:
        # TODO: Query memory records by semantic and keyword strategies.
        del query
        return []
