from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Equipment Maintenance Agent"
    app_env: str = "development"
    api_prefix: str = "/api"
    data_dir: str = "../data"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def data_path(self) -> Path:
        backend_dir = Path(__file__).resolve().parents[3]
        return (backend_dir / self.data_dir).resolve()


settings = Settings()

