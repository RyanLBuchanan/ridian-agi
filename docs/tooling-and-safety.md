# Tooling And Safety

Little Ridian AGI treats tools as governed capabilities, not raw powers.

## Tool Model

Each tool declares:

- tool name
- purpose
- risk level
- whether approval is required
- whether it is enabled by default

This keeps the registry explicit and reviewable.

## Initial Tool Set

1. `file_read`

- Purpose: read local project files for context.
- Risk: moderate.
- Approval required: no.
- Enabled by default: yes.

2. `file_write`

- Purpose: write or modify files.
- Risk: high.
- Approval required: yes.
- Enabled by default: no.

3. `project_file_list`

- Purpose: list project files and structure.
- Risk: low.
- Approval required: no.
- Enabled by default: yes.

4. `internal_search_placeholder`

- Purpose: future internal knowledge/project search.
- Risk: low.
- Approval required: no.
- Enabled by default: yes.

5. `url_fetch_placeholder`

- Purpose: future controlled external fetch.
- Risk: moderate.
- Approval required: no.
- Enabled by default: yes.

6. `shell_command_placeholder`

- Purpose: future shell execution under explicit controls.
- Risk: critical.
- Approval required: yes.
- Enabled by default: no.

## Risk Classification

- `low`: safe informational capability with limited downside.
- `moderate`: bounded read-oriented or network-oriented capability.
- `high`: potentially mutating capability with meaningful downside.
- `critical`: direct execution or highly sensitive capability.

## Centralized Safety Wall

The permissions checker acts as a centralized safety wall for tool access.

- Disabled-by-default tools are blocked unless explicitly approved.
- Approval-required tools are blocked without approval.
- Shell command access is tightly gated and blocked by default.
- Tool execution is routed through the same checker rather than scattered ad hoc conditions.

## Audit Logging

Tool actions generate structured audit events for:

- consideration
- execution request
- blocked execution
- completed execution

Each audit record includes tool name, action, outcome, reason, risk level, actor, and optional run ID.

## Current Phase Boundaries

- Real destructive behavior is intentionally deferred.
- Placeholder tools may return informative non-executing results.
- TODO: add payload validation and per-tool schemas.
- TODO: persist audit events to durable storage.
- TODO: add user/session-aware approval flows.
