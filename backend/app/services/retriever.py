from app.schemas.query import EvidenceItem


class Retriever:
    async def search(
        self, question: str, device_model: str | None = None
    ) -> list[EvidenceItem]:
        # 当前返回占位证据；后续可以在这里接异步向量库、数据库或模型服务。
        device_hint = device_model or "unknown model"
        return [
            EvidenceItem(
                source=f"manual::{device_hint}",
                page=None,
                snippet=(
                    "Evidence placeholder. Replace this with indexed manual chunks "
                    "and page references."
                ),
            )
        ]
