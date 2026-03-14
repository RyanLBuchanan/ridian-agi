# Ridian Cortex

Ridian Cortex is a standalone cognitive console built on Ridian OS: a workspace-native AGI experiment designed to be calm, trustworthy, and extensible.

## Stack

- Frontend: Next.js (App Router, TypeScript)
- Backend: FastAPI (Python)
- Database: PostgreSQL-ready foundation
- Model provider: OpenAI-first via a router abstraction

## Repository Layout

- `apps/web`: Next.js workspace interface
- `apps/api`: FastAPI orchestration backend
- `docs`: architecture and implementation planning docs

## Quick Start

### 1. Backend

```bash
cd apps/api
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend endpoints:

- `GET /api/health`
- `POST /api/chat`

### 2. Frontend

```bash
cd apps/web
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

For deployment and environment details, see `apps/web/README.md`.

## MVP Scope Included

- Workspace shell UI with nav, chat/command center, and context panel placeholders
- FastAPI routes for health and chat
- Orchestrator flow stub with logging, permissions, verification, and trace seams
- Model router abstraction with OpenAI provider placeholder behavior
- Memory, tools, agents, retrieval service scaffolding
- Database-ready SQLAlchemy base and starter models

## Notes

- This scaffold is intentionally modular with clear TODO markers where deeper implementation is deferred.
- Single-user-first architecture; multi-user evolution is planned in later phases.
