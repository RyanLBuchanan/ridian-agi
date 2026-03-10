from functools import lru_cache

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

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
