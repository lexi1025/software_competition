from app.schemas.query import EvidenceItem


class Retriever:
    async def search(
        self, question: str, device_model: str | None = None
    ) -> list[EvidenceItem]:
        # 当前返回占位证据；后续可以在这里接异步向量库、数据库或模型服务。
        device_hint = device_model or "未知型号"
        return [
            EvidenceItem(
                source=f"manual::{device_hint}",
                page=None,
                snippet="当前为占位证据，后续将替换为真实的手册分块内容和页码引用。",
            )
        ]
