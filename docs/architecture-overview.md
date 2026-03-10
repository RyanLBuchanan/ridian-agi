# Architecture Overview

## Intent

Little Ridian AGI builds on the spirit of Ridian OS while introducing cleaner seams between cognition, execution, and safety.

## Layers

1. Interface Layer (`apps/web`)

- Workspace shell and command surface.
- Panels for memory, plans, tools, and agent activity.

2. API + Orchestrator Layer (`apps/api/app/api`, `apps/api/app/services/orchestrator`)

- Receives user intent.
- Coordinates planning, tool use, verification, and response shaping.

3. Model Router Layer (`apps/api/app/services/model_router`)

- Provider-agnostic interface.
- OpenAI-first implementation for v1.

4. Memory Layer (`apps/api/app/services/memory`)

- Structured memory read/write seam.
- SQLAlchemy models prepared for persistence.

5. Retrieval Layer (`apps/api/app/services/retrieval`)

- Placeholder semantic retrieval contract.
- Designed for future vector index integration.

6. Tool Layer (`apps/api/app/services/tools`)

- Registry of callable tools with typed execution path.

7. Agent Layer (`apps/api/app/services/agents`)

- Registry of specialist agents and capabilities.

8. Verification + Permissions Layers (`apps/api/app/services/verification`, `apps/api/app/services/permissions`)

- Verify action safety and output quality before high-impact steps.

9. Observability Layer (`apps/api/app/services/tracing`, `apps/api/app/core/logging.py`)

- Task run IDs, event traces, and structured logging.

## Core Request Flow (v1)

1. Client posts message to `POST /api/chat`.
2. API creates run context and calls orchestrator.
3. Orchestrator checks permissions.
4. Orchestrator obtains plan and routes model call.
5. Optional tools/agents are selected (currently stubbed).
6. Verifier checks result confidence/risk.
7. Response and trace metadata returned to client.

## Data Foundations

- `TaskRun`: tracks each orchestration cycle.
- `MemoryRecord`: stores memory artifacts and metadata.

## Design Principles

- Calm architecture over clever architecture.
- Explicit seams over hidden coupling.
- Safety and traceability before autonomy.
- Practical v1 implementation with clear TODOs for deeper capability.
