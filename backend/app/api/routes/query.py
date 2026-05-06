from fastapi import APIRouter

from app.schemas.query import QueryRequest, QueryResponse
from app.services.agent_harness import AgentHarness


router = APIRouter()


@router.post("", response_model=QueryResponse)
def run_query(payload: QueryRequest) -> QueryResponse:
    harness = AgentHarness()
    return harness.answer(payload)

