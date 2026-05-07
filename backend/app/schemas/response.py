from typing import Any, Generic, TypeVar

from pydantic import BaseModel


T = TypeVar("T")


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | list[dict[str, Any]] | None = None


class ApiResponse(BaseModel, Generic[T]):
    # 公开 API 使用统一 envelope，前端可以用同一套逻辑处理成功、错误和 trace 信息。
    success: bool
    data: T | None
    error: ErrorResponse | None
    trace_id: str


def success_response(data: T, trace_id: str) -> ApiResponse[T]:
    # envelope 只属于 HTTP 层；service 层继续返回业务数据。
    return ApiResponse(success=True, data=data, error=None, trace_id=trace_id)


def error_response(
    code: str,
    message: str,
    trace_id: str,
    details: dict[str, Any] | list[dict[str, Any]] | None = None,
) -> ApiResponse[None]:
    return ApiResponse(
        success=False,
        data=None,
        error=ErrorResponse(code=code, message=message, details=details),
        trace_id=trace_id,
    )
