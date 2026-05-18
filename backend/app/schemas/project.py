from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.project import ProjectType, ProjectStatus


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: ProjectType = ProjectType.OTHER


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str] = None
    project_type: ProjectType
    status: ProjectStatus
    task_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
