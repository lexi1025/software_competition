from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Equipment Maintenance Agent"
    app_env: str = "development"
    debug: bool = False
    api_prefix: str = "/api"
    cors_origins: list[str] = [
        "http://localhost:8001",
        "http://127.0.0.1:8001",
    ]
    data_dir: str = "../data"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        # .env 中使用逗号分隔字符串，测试或代码中也可以直接传 list。
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value: bool | str) -> bool:
        # 某些环境会全局设置 DEBUG=release，这里按生产模式处理，避免配置初始化失败。
        if isinstance(value, str) and value.lower() in {"release", "prod", "production"}:
            return False
        return value

    @property
    def data_path(self) -> Path:
        # 相对路径基于 backend 项目根目录解析，而不是基于命令执行目录解析。
        backend_dir = Path(__file__).resolve().parents[3]
        return (backend_dir / self.data_dir).resolve()


settings = Settings()
