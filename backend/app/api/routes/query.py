from fastapi import APIRouter, Request

from app.schemas.query import QueryRequest, QueryResponse
from app.schemas.response import ApiResponse, success_response
from app.services.agent_harness import AgentHarness


router = APIRouter()


@router.post("", response_model=ApiResponse[QueryResponse])
async def run_query(
    request: Request, payload: QueryRequest
) -> ApiResponse[QueryResponse]:
    # AgentHarness 负责具体任务流程；这里仅做 HTTP 请求到任务流程的适配。
    harness = AgentHarness()
    result = await harness.answer(payload)
    return success_response(data=result, trace_id=request.state.trace_id)
