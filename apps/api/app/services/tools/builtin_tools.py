from app.services.permissions.models import RiskLevel
from app.services.tools.base import BaseTool, ToolExecutionResult, ToolInvocationContext, ToolMetadata


class FileReadTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="file_read",
                purpose="Read a project file when the orchestrator needs local context.",
                risk_level="moderate",
                requires_approval=False,
                enabled_by_default=True,
            )
        )

    def execute(self, payload: dict[str, object], context: ToolInvocationContext) -> ToolExecutionResult:
        del payload
        del context
        return ToolExecutionResult(
            success=False,
            status="placeholder",
            message="file_read is registered, but real file access remains intentionally deferred.",
        )


class FileWriteTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="file_write",
                purpose="Write or modify project files under explicit approval.",
                risk_level="high",
                requires_approval=True,
                enabled_by_default=False,
            )
        )


class ProjectFileListTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="project_file_list",
                purpose="List available project files to support navigation and planning.",
                risk_level="low",
                requires_approval=False,
                enabled_by_default=True,
            )
        )


class InternalSearchPlaceholderTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="internal_search_placeholder",
                purpose="Search internal project knowledge once a real search adapter is wired in.",
                risk_level="low",
                requires_approval=False,
                enabled_by_default=True,
            )
        )


class UrlFetchPlaceholderTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="url_fetch_placeholder",
                purpose="Fetch external URLs once controlled network access is added.",
                risk_level="moderate",
                requires_approval=False,
                enabled_by_default=True,
            )
        )


class ShellCommandPlaceholderTool(BaseTool):
    def __init__(self) -> None:
        super().__init__(
            metadata=ToolMetadata(
                name="shell_command_placeholder",
                purpose="Run shell commands only under explicit approval and strict gating.",
                risk_level="critical",
                requires_approval=True,
                enabled_by_default=False,
            )
        )

    def execute(self, payload: dict[str, object], context: ToolInvocationContext) -> ToolExecutionResult:
        del payload
        del context
        return ToolExecutionResult(
            success=False,
            status="blocked_placeholder",
            message="Shell command execution is intentionally gated and not implemented in this phase.",
        )


def get_builtin_tools() -> tuple[BaseTool, ...]:
    """Return the first toolset for Little Ridian AGI."""

    return (
        FileReadTool(),
        FileWriteTool(),
        ProjectFileListTool(),
        InternalSearchPlaceholderTool(),
        UrlFetchPlaceholderTool(),
        ShellCommandPlaceholderTool(),
    )
