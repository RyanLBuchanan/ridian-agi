from dataclasses import dataclass
from typing import Protocol

from app.services.permissions.models import RiskLevel


@dataclass(frozen=True)
class ToolMetadata:
    """Declarative metadata for a registry-managed tool."""

    name: str
    purpose: str
    risk_level: RiskLevel
    requires_approval: bool
    enabled_by_default: bool


@dataclass(frozen=True)
class ToolInvocationContext:
    """Execution context for tool calls.

    This is intentionally small for the first version and can grow once real
    execution environments and user identity are wired in.
    """

    actor: str = "orchestrator"
    run_id: str | None = None
    approval_granted: bool = False


@dataclass(frozen=True)
class ToolExecutionResult:
    """Stable result returned from tool invocation attempts."""

    success: bool
    status: str
    message: str
    output: dict[str, object] | None = None


class ToolDefinition(Protocol):
    """Minimal interface for concrete tool implementations."""

    metadata: ToolMetadata

    def execute(
        self,
        payload: dict[str, object],
        context: ToolInvocationContext,
    ) -> ToolExecutionResult:
        """Execute the tool for the given payload and invocation context."""


@dataclass(frozen=True)
class BaseTool:
    """Small base class for safe placeholder tools."""

    metadata: ToolMetadata

    def execute(
        self,
        payload: dict[str, object],
        context: ToolInvocationContext,
    ) -> ToolExecutionResult:
        del payload
        del context
        return ToolExecutionResult(
            success=False,
            status="not_implemented",
            message=f"Tool '{self.metadata.name}' is registered but not fully implemented yet.",
        )