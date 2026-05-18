from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.agents import router as agents_router

router = APIRouter(prefix="/v1")
router.include_router(auth_router)
router.include_router(projects_router)
router.include_router(tasks_router)
router.include_router(agents_router)
