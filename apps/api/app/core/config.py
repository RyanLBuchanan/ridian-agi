from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Little Ridian AGI API"
    environment: str = "development"
    log_level: str = "INFO"

    api_prefix: str = "/api"
    cors_origins: list[str] = ["http://localhost:3000"]

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/little_ridian_agi"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            normalized = value.strip()
            if not normalized:
                return []
            if normalized.startswith("[") and normalized.endswith("]"):
                items = normalized[1:-1].split(",")
                return [item.strip().strip('"').strip("'") for item in items if item.strip()]
            return [item.strip() for item in normalized.split(",") if item.strip()]
        return ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
