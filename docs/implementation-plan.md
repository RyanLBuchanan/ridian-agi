# Implementation Plan

## Phase 1 (Current Scaffold)

1. Establish monorepo layout and docs.
2. Deliver runnable Next.js + FastAPI baseline.
3. Implement chat endpoint with orchestrator stub path.
4. Add service seams for memory, retrieval, tools, agents, permissions, verification, and tracing.
5. Add PostgreSQL-ready settings and base models.

## Phase 2 (Near-Term)

1. Replace placeholder model behavior with robust prompt contracts.
2. Persist task traces and memory records to Postgres.
3. Add retrieval indexing and ranking pipeline.
4. Harden policy checks and add approval gates for sensitive actions.

## Phase 3 (Expansion)

1. Multi-user workspace roles and tenancy.
2. Advanced model routing and fallback providers.
3. Deeper GitHub and productivity integrations.
4. Long-running task orchestration and background workers.

## v1 Acceptance Checklist

- [x] Frontend shell and chat surface present
- [x] Backend health and chat routes present
- [x] Orchestrator and service modules scaffolded
- [x] Env examples included for root/web/api
- [x] Documentation for architecture and phased plan

## TODO Markers

This scaffold includes `TODO:` notes in service modules where production logic is deferred intentionally.
