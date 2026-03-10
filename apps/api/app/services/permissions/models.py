from dataclasses import dataclass
from typing import Literal

RiskLevel = Literal["low", "moderate", "high", "critical"]


@dataclass(frozen=True)
class PermissionDecision:
    """Permission outcome for an action or tool request."""

    allowed: bool
    reason: str
    risk_level: RiskLevel = "low"
    requires_approval: bool = False


@dataclass(frozen=True)
class ToolPermissionRequest:
    """Normalized permission input for a tool action."""

    tool_name: str
    risk_level: RiskLevel
    requires_approval: bool
    enabled_by_default: bool