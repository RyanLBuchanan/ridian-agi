from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class ModelRequest:
    """Normalized model input assembled by the orchestrator."""

    prompt: str
    execution_mode: str


@dataclass(frozen=True)
class ModelResult:
    """Provider response metadata returned to the orchestrator."""

    provider_name: str
    model_name: str
    text: str


class BaseModelProvider(ABC):
    @abstractmethod
    def generate(self, request: ModelRequest) -> ModelResult:
        raise NotImplementedError
