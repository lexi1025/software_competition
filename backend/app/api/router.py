from fastapi import APIRouter

from app.api.routes import health, manuals, query


api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(manuals.router, prefix="/manuals", tags=["manuals"])
api_router.include_router(query.router, prefix="/query", tags=["query"])

