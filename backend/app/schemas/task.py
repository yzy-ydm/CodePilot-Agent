from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.task import AgentType, TaskStatus


class TaskCreate(BaseModel):
    project_id: Optional[UUID] = None
    agent_type: AgentType
    title: Optional[str] = None
    input: str


class TaskResponse(BaseModel):
    id: UUID
    project_id: Optional[UUID] = None
    user_id: UUID
    agent_type: AgentType
    title: Optional[str] = None
    input: str
    output: Optional[str] = None
    status: TaskStatus
    error_message: Optional[str] = None
    tokens_used: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
