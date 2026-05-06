from pydantic import BaseModel, Field


class ManualRegisterRequest(BaseModel):
    file_path: str = Field(description="Absolute or project-relative path to a PDF.")
    device_name: str = Field(description="Human-readable device name.")
    device_model: str | None = Field(default=None, description="Optional device model.")


class ManualRegisterResponse(BaseModel):
    manual_id: str
    file_path: str
    page_count: int | None = None
    status: str
    next_step: str

