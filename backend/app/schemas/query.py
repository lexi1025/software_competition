from typing import Annotated

from pydantic import BaseModel, Field
from pydantic import StringConstraints


NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class QueryRequest(BaseModel):
    question: NonEmptyStr = Field(description="Fault question or task request.")
    device_name: str | None = None
    device_model: str | None = None


class EvidenceItem(BaseModel):
    source: str
    page: int | None = None
    snippet: str


class PlanStep(BaseModel):
    step: str
    status: str


class QueryResponse(BaseModel):
    answer: str
    plan: list[PlanStep]
    evidence: list[EvidenceItem]
