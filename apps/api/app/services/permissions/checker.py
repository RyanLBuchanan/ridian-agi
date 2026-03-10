from app.services.permissions.models import PermissionDecision, ToolPermissionRequest


class PermissionsChecker:
    """Centralized permissions and safety wall for actions and tools."""

    def check(self, action: str) -> PermissionDecision:
        """Check a non-tool action against the current policy."""

        # TODO: Replace with role-aware policy engine and scoped action controls.
        if not action.strip():
            return PermissionDecision(allowed=False, reason="invalid_action")
        return PermissionDecision(allowed=True, reason="allowed")

    def check_tool(
        self,
        request: ToolPermissionRequest,
        *,
        approval_granted: bool = False,
    ) -> PermissionDecision:
        """Check whether a tool is allowed through the centralized safety wall."""

        if request.tool_name == "shell_command_placeholder" and not approval_granted:
            return PermissionDecision(
                allowed=False,
                reason="shell_command_requires_manual_approval",
                risk_level=request.risk_level,
                requires_approval=True,
            )

        if not request.enabled_by_default and not approval_granted:
            return PermissionDecision(
                allowed=False,
                reason="tool_disabled_by_default",
                risk_level=request.risk_level,
                requires_approval=request.requires_approval,
            )

        if request.requires_approval and not approval_granted:
            return PermissionDecision(
                allowed=False,
                reason="approval_required",
                risk_level=request.risk_level,
                requires_approval=True,
            )

        return PermissionDecision(
            allowed=True,
            reason="tool_allowed",
            risk_level=request.risk_level,
            requires_approval=request.requires_approval,
        )

    def can_execute(self, action: str) -> bool:
        """Compatibility helper that returns only the allow/deny boolean."""

        return self.check(action).allowed


PermissionChecker = PermissionsChecker
