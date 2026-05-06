from pathlib import Path
from uuid import uuid4

from app.schemas.manual import ManualRegisterRequest, ManualRegisterResponse


class ManualIndexer:
    def register_manual(
        self, payload: ManualRegisterRequest
    ) -> ManualRegisterResponse:
        file_path = Path(payload.file_path)
        if not file_path.is_absolute():
            file_path = Path.cwd() / file_path

        if not file_path.exists():
            raise FileNotFoundError(f"Manual not found: {file_path}")

        return ManualRegisterResponse(
            manual_id=str(uuid4()),
            file_path=str(file_path.resolve()),
            page_count=None,
            status="registered",
            next_step="Implement PDF parsing and page-level indexing.",
        )

