from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AgentLogResponse(BaseModel):
    id: UUID
    task_id: UUID
    agent_name: str
    action: str
    input: Optional[str] = None
    output: Optional[str] = None
    tokens_used: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AgentExecuteRequest(BaseModel):
    task_id: UUID
    agent_type: str
    input: str
    project_context: Optional[str] = None
