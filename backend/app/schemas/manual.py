from typing import Annotated

from pydantic import BaseModel, Field
from pydantic import StringConstraints


NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class ManualRegisterRequest(BaseModel):
    file_path: NonEmptyStr = Field(
        description="Absolute or project-relative path to a PDF."
    )
    device_name: NonEmptyStr = Field(description="Human-readable device name.")
    device_model: str | None = Field(default=None, description="Optional device model.")


class ManualRegisterResponse(BaseModel):
    manual_id: str
    file_path: str
    page_count: int | None = None
    status: str
    next_step: str
