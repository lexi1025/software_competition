from fastapi import APIRouter, HTTPException

from app.schemas.manual import ManualRegisterRequest, ManualRegisterResponse
from app.services.manual_indexer import ManualIndexer


router = APIRouter()


@router.post("/register", response_model=ManualRegisterResponse)
def register_manual(payload: ManualRegisterRequest) -> ManualRegisterResponse:
    indexer = ManualIndexer()
    try:
        return indexer.register_manual(payload)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

