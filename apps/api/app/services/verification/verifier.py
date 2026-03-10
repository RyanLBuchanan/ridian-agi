from dataclasses import dataclass


@dataclass(frozen=True)
class VerificationResult:
    """Verification outcome returned before final response assembly."""

    verified: bool
    status: str
    final_text: str


class Verifier:
    """Applies simple return-time checks before a response is assembled."""

    def should_verify(self, user_message: str) -> bool:
        """Return whether the request explicitly asks for checking or validation."""

        normalized = user_message.lower()
        return any(keyword in normalized for keyword in ["verify", "review", "check", "confirm", "validate"])

    def verify_response(self, text: str) -> VerificationResult:
        # TODO: Add confidence scoring, citation checks, and policy/risk classification.
        if not text.strip():
            return VerificationResult(
                verified=False,
                status="empty_output",
                final_text="I could not produce a verified response yet.",
            )
        return VerificationResult(verified=True, status="ok", final_text=text)

    def verify(self, text: str) -> tuple[bool, str]:
        result = self.verify_response(text)
        return result.verified, result.status
