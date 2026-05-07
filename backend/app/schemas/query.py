from typing import Annotated

from pydantic import BaseModel, Field
from pydantic import StringConstraints


NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class QueryRequest(BaseModel):
    question: NonEmptyStr = Field(description="故障问题或任务请求。")
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
