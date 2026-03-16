from openai import OpenAI

from app.core.config import settings
from app.services.model_router.base import BaseModelProvider, ModelRequest, ModelResult


class OpenAIProvider(BaseModelProvider):
    """OpenAI-backed provider with an honest placeholder path when unconfigured."""

    def __init__(self) -> None:
        self._client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    def generate(self, request: ModelRequest) -> ModelResult:
        # TODO: Add robust system prompts, tool-calling schema, and retries.
        if self._client is None:
            return ModelResult(
                provider_name="openai",
                model_name=settings.openai_model,
                text=(
                    "Model routing completed, but no external model provider is configured yet. "
                    "The orchestration spine assembled the request successfully and is ready for a real provider call."
                ),
            )

        # NOTE: The repository pins openai==1.44.0, where text generation is exposed via
        # chat.completions (not the newer responses API).
        response = self._client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {
                    "role": "user",
                    "content": request.prompt,
                }
            ],
        )
        first_choice = response.choices[0] if response.choices else None
        first_message = first_choice.message if first_choice else None
        message_content = first_message.content if first_message else None
        if isinstance(message_content, str):
            response_text = message_content.strip() or "No output produced."
        else:
            response_text = "No output produced."
        return ModelResult(
            provider_name="openai",
            model_name=settings.openai_model,
            text=response_text,
        )
