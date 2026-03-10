from dataclasses import dataclass


@dataclass(frozen=True)
class RetrievalHit:
    """Single retrieval item returned to the orchestrator."""

    source: str
    content: str


class RetrievalProvider:
    """Retrieval seam for future project/document search integration."""

    def retrieve(self, query: str) -> list[RetrievalHit]:
        # TODO: Implement semantic retrieval from project docs and memory vectors.
        del query
        return []

    def retrieve_context(self, query: str) -> list[str]:
        """Compatibility helper that flattens retrieval hits into plain text context."""

        return [hit.content for hit in self.retrieve(query)]


RetrievalService = RetrievalProvider
