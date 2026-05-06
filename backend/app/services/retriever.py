from app.schemas.query import EvidenceItem


class Retriever:
    def search(
        self, question: str, device_model: str | None = None
    ) -> list[EvidenceItem]:
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

