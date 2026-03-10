from dataclasses import dataclass

from app.domain.schemas.chat import ExecutionMode
from app.core.config import settings
from app.services.model_router.base import ModelRequest, ModelResult
from app.services.model_router.openai_provider import OpenAIProvider


@dataclass(frozen=True)
class ModelRoute:
    """Selected provider route for the current orchestration mode."""

    provider_name: str
    model_name: str
    rationale: str


class ModelRouter:
    """Chooses a model route and delegates generation to the current provider."""

    def __init__(self) -> None:
        self._provider = OpenAIProvider()

    def route(self, execution_mode: ExecutionMode) -> ModelRoute:
        # TODO: Add multi-provider routing policy with fallback and budget controls.
        return ModelRoute(
            provider_name="openai",
            model_name=settings.openai_model,
            rationale=f"OpenAI is the primary provider for v1 mode={execution_mode}.",
        )

    def generate(self, prompt: str, execution_mode: ExecutionMode) -> ModelResult:
        route = self.route(execution_mode)
        request = ModelRequest(prompt=prompt, execution_mode=execution_mode)
        result = self._provider.generate(request)
        return ModelResult(
            provider_name=route.provider_name,
            model_name=result.model_name,
            text=result.text,
        )
