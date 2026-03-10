import re

from app.domain.schemas.memory import MemoryType, MemoryWriteDecision, MemoryWriteRequest

_SECRET_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"api[_-]?key",
        r"password",
        r"secret",
        r"token",
        r"private[_-]?key",
        r"bearer\s+[a-z0-9._-]+",
    ]
]

_TRANSIENT_MESSAGES = {"hi", "hello", "thanks", "thank you", "ok", "okay", "cool"}


class MemoryWritePolicy:
    """Disciplined write policy so the system does not store everything.

    The policy favors durable preferences, project facts, and task outcomes while
    rejecting obvious secrets and low-signal conversational noise.
    """

    def evaluate(self, request: MemoryWriteRequest) -> MemoryWriteDecision:
        normalized_content = request.content.strip()
        if not normalized_content:
            return MemoryWriteDecision(should_store=False, reason="empty_content")

        if self._contains_secret_like_content(normalized_content):
            return MemoryWriteDecision(should_store=False, reason="secret_like_content")

        if normalized_content.lower() in _TRANSIENT_MESSAGES:
            return MemoryWriteDecision(should_store=False, reason="transient_small_talk")

        if len(normalized_content) < 12 and request.memory_type != "user_preference":
            return MemoryWriteDecision(should_store=False, reason="too_short_for_durable_memory")

        if request.memory_type == "user_preference":
            return MemoryWriteDecision(
                should_store=self._is_preference_worthy(request.content),
                reason="preference_detected" if self._is_preference_worthy(request.content) else "preference_not_durable",
                normalized_tags=self._normalized_tags(request.memory_type, request.key),
            )

        if request.memory_type == "project":
            should_store = self._contains_project_signal(request.content, request.key)
            return MemoryWriteDecision(
                should_store=should_store,
                reason="project_fact_detected" if should_store else "project_signal_missing",
                normalized_tags=self._normalized_tags(request.memory_type, request.key),
            )

        if request.memory_type == "episode":
            should_store = self._contains_episode_signal(request.content)
            return MemoryWriteDecision(
                should_store=should_store,
                reason="episode_signal_detected" if should_store else "episode_signal_missing",
                normalized_tags=self._normalized_tags(request.memory_type, request.key),
            )

        if request.memory_type == "session":
            should_store = self._contains_session_signal(request.content)
            return MemoryWriteDecision(
                should_store=should_store,
                reason="session_signal_detected" if should_store else "session_signal_missing",
                normalized_tags=self._normalized_tags(request.memory_type, request.key),
            )

        return MemoryWriteDecision(should_store=False, reason="unsupported_memory_type")

    def _contains_secret_like_content(self, content: str) -> bool:
        return any(pattern.search(content) for pattern in _SECRET_PATTERNS)

    def _is_preference_worthy(self, content: str) -> bool:
        normalized = content.lower()
        return any(term in normalized for term in ["prefer", "preference", "always", "never", "default", "style"])

    def _contains_project_signal(self, content: str, key: str) -> bool:
        normalized = f"{key} {content}".lower()
        return any(term in normalized for term in ["api", "route", "model", "service", "schema", "architecture", "repo", "frontend", "backend"])

    def _contains_episode_signal(self, content: str) -> bool:
        normalized = content.lower()
        return any(term in normalized for term in ["decided", "completed", "result", "outcome", "next step", "blocked", "resolved"])

    def _contains_session_signal(self, content: str) -> bool:
        normalized = content.lower()
        return any(term in normalized for term in ["working on", "current task", "need to", "next", "follow up", "remember for this session"])

    def _normalized_tags(self, memory_type: MemoryType, key: str) -> list[str]:
        normalized_key = key.lower().replace(" ", "_")
        return [memory_type, normalized_key]