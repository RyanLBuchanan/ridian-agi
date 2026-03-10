from dataclasses import dataclass


@dataclass(frozen=True)
class PermissionDecision:
    """Permission outcome for a requested orchestrator action."""

    allowed: bool
    reason: str


class PermissionsChecker:
    """Single-user-first permission gate with a future policy seam."""

    def check(self, action: str) -> PermissionDecision:
        # TODO: Replace with role-aware policy engine and scoped action controls.
        if not action.strip():
            return PermissionDecision(allowed=False, reason="invalid_action")
        return PermissionDecision(allowed=True, reason="allowed")

    def can_execute(self, action: str) -> bool:
        """Compatibility helper that returns only the allow/deny boolean."""

        return self.check(action).allowed


PermissionChecker = PermissionsChecker
