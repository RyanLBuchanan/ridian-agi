from fastapi import APIRouter

from app.domain.schemas.chat import ChatRequest, ChatResponse
from app.services.orchestrator.orchestrator_service import Orchestrator

router = APIRouter()
orchestrator = Orchestrator()


@router.post(
    "/chat",
    response_model=ChatResponse,
    response_model_by_alias=True,
    summary="Create chat response",
    response_description="Structured orchestrator response for a single chat turn.",
)
def chat(request: ChatRequest) -> ChatResponse:
    """Route a single chat message through the orchestration spine."""

    # TODO: Add request-scoped identity/session context before orchestration.
    return orchestrator.handle_chat(request)
