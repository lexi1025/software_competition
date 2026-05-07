from fastapi import APIRouter, Request

from app.core.config import settings
from app.schemas.response import ApiResponse, success_response


router = APIRouter()


@router.get("/health", response_model=ApiResponse[dict[str, str]])
async def health_check(request: Request) -> ApiResponse[dict[str, str]]:
    # 健康检查返回应用元信息，方便部署后确认当前运行的是哪个服务。
    return success_response(
        data={
            "status": "ok",
            "app_name": settings.app_name,
            "app_env": settings.app_env,
        },
        trace_id=request.state.trace_id,
    )
