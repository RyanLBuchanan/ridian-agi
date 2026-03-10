from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.services.permissions.models import RiskLevel


@dataclass(frozen=True)
class ToolAuditRecord:
    """Structured audit event for tool consideration or invocation."""

    timestamp: datetime
    tool_name: str
    action: str
    outcome: str
    reason: str
    risk_level: RiskLevel
    actor: str = "orchestrator"
    run_id: str | None = None


@dataclass
class ToolAuditLog:
    records: list[ToolAuditRecord] = field(default_factory=list)


class ToolAuditLogger:
    """In-process audit logger for tool actions.

    TODO: Persist audit records to durable run logging once a database-backed
    audit trail is introduced.
    """

    def __init__(self) -> None:
        self._log = ToolAuditLog()

    def record(
        self,
        *,
        tool_name: str,
        action: str,
        outcome: str,
        reason: str,
        risk_level: RiskLevel,
        actor: str = "orchestrator",
        run_id: str | None = None,
    ) -> None:
        self._log.records.append(
            ToolAuditRecord(
                timestamp=datetime.now(timezone.utc),
                tool_name=tool_name,
                action=action,
                outcome=outcome,
                reason=reason,
                risk_level=risk_level,
                actor=actor,
                run_id=run_id,
            )
        )

    def list_records(self) -> list[ToolAuditRecord]:
        return list(self._log.records)