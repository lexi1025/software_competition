from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    question: str = Field(description="Fault question or task request.")
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

