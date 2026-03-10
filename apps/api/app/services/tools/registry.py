from dataclasses import dataclass

from app.services.permissions.checker import PermissionsChecker
from app.services.permissions.models import ToolPermissionRequest
from app.services.tools.audit import ToolAuditLogger
from app.services.tools.base import BaseTool, ToolExecutionResult, ToolInvocationContext, ToolMetadata
from app.services.tools.builtin_tools import get_builtin_tools


@dataclass(frozen=True)
class ToolCandidate:
    """Tool the orchestrator may consider without executing automatically."""

    name: str
    purpose: str
    risk_level: str
    requires_approval: bool
    enabled_by_default: bool
    allowed: bool
    decision_reason: str
    rationale: str


class ToolRegistry:
    """Registry for known tools and safety-aware tool consideration."""

    def __init__(self) -> None:
        self._tools: dict[str, BaseTool] = {
            tool.metadata.name: tool for tool in get_builtin_tools()
        }
        self.audit_logger = ToolAuditLogger()

    def list_tools(self) -> list[ToolMetadata]:
        return [tool.metadata for tool in self._tools.values()]

    def get_tool(self, name: str) -> BaseTool | None:
        return self._tools.get(name)

    def consider(
        self,
        user_message: str,
        permissions: PermissionsChecker | None = None,
        *,
        approval_granted: bool = False,
        actor: str = "orchestrator",
        run_id: str | None = None,
    ) -> list[ToolCandidate]:
        # TODO: Replace keyword heuristics with structured intent-to-tool planning.
        normalized = user_message.lower()
        candidate_names: list[str] = []
        if any(keyword in normalized for keyword in ["read", "open", "file"]):
            candidate_names.append("file_read")
        if any(keyword in normalized for keyword in ["write", "edit", "save", "modify"]):
            candidate_names.append("file_write")
        if any(keyword in normalized for keyword in ["list", "project", "files", "structure"]):
            candidate_names.append("project_file_list")
        if any(keyword in normalized for keyword in ["search", "lookup", "find"]):
            candidate_names.append("internal_search_placeholder")
        if any(keyword in normalized for keyword in ["url", "website", "web", "fetch"]):
            candidate_names.append("url_fetch_placeholder")
        if any(keyword in normalized for keyword in ["shell", "command", "terminal", "execute", "run"]):
            candidate_names.append("shell_command_placeholder")

        candidates: list[ToolCandidate] = []
        for name in list(dict.fromkeys(candidate_names)):
            tool = self._tools.get(name)
            if tool is None:
                continue

            decision_reason = "tool_considered"
            allowed = tool.metadata.enabled_by_default
            if permissions is not None:
                decision = permissions.check_tool(
                    ToolPermissionRequest(
                        tool_name=tool.metadata.name,
                        risk_level=tool.metadata.risk_level,
                        requires_approval=tool.metadata.requires_approval,
                        enabled_by_default=tool.metadata.enabled_by_default,
                    ),
                    approval_granted=approval_granted,
                )
                allowed = decision.allowed
                decision_reason = decision.reason

            self.audit_logger.record(
                tool_name=tool.metadata.name,
                action="considered",
                outcome="allowed" if allowed else "blocked",
                reason=decision_reason,
                risk_level=tool.metadata.risk_level,
                actor=actor,
                run_id=run_id,
            )

            candidates.append(
                ToolCandidate(
                    name=tool.metadata.name,
                    purpose=tool.metadata.purpose,
                    risk_level=tool.metadata.risk_level,
                    requires_approval=tool.metadata.requires_approval,
                    enabled_by_default=tool.metadata.enabled_by_default,
                    allowed=allowed,
                    decision_reason=decision_reason,
                    rationale=f"Matched request keywords for {tool.metadata.name}.",
                )
            )
        return candidates

    def execute(
        self,
        name: str,
        payload: dict[str, object],
        permissions: PermissionsChecker,
        context: ToolInvocationContext | None = None,
    ) -> ToolExecutionResult:
        """Attempt execution through the centralized permissions wall.

        TODO: Add payload schema validation before real tool execution is enabled.
        """

        invocation_context = context or ToolInvocationContext()
        tool = self._tools.get(name)
        if tool is None:
            return ToolExecutionResult(
                success=False,
                status="tool_not_found",
                message=f"Tool '{name}' is not registered.",
            )

        decision = permissions.check_tool(
            ToolPermissionRequest(
                tool_name=tool.metadata.name,
                risk_level=tool.metadata.risk_level,
                requires_approval=tool.metadata.requires_approval,
                enabled_by_default=tool.metadata.enabled_by_default,
            ),
            approval_granted=invocation_context.approval_granted,
        )
        if not decision.allowed:
            self.audit_logger.record(
                tool_name=tool.metadata.name,
                action="execution_requested",
                outcome="blocked",
                reason=decision.reason,
                risk_level=tool.metadata.risk_level,
                actor=invocation_context.actor,
                run_id=invocation_context.run_id,
            )
            return ToolExecutionResult(
                success=False,
                status="permission_blocked",
                message=f"Tool '{name}' was blocked by the safety wall: {decision.reason}.",
            )

        result = tool.execute(payload, invocation_context)
        self.audit_logger.record(
            tool_name=tool.metadata.name,
            action="executed",
            outcome="success" if result.success else result.status,
            reason=result.message,
            risk_level=tool.metadata.risk_level,
            actor=invocation_context.actor,
            run_id=invocation_context.run_id,
        )
        return result
