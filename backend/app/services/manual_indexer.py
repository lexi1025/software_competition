from pathlib import Path
from uuid import uuid4

from app.schemas.manual import ManualRegisterRequest, ManualRegisterResponse


class ManualIndexer:
    async def register_manual(
        self, payload: ManualRegisterRequest
    ) -> ManualRegisterResponse:
        # 当前仍是轻量路径检查；后续可替换为异步 PDF 解析和索引构建。
        file_path = Path(payload.file_path)
        if not file_path.is_absolute():
            file_path = Path.cwd() / file_path

        if not file_path.exists():
            raise FileNotFoundError(f"未找到维修手册文件：{file_path}")

        return ManualRegisterResponse(
            manual_id=str(uuid4()),
            file_path=str(file_path.resolve()),
            page_count=None,
            status="已注册",
            next_step="下一步需要接入 PDF 解析和按页索引构建流程。",
        )
