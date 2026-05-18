import sys
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Ensure the project root is on sys.path so 'agent' module is importable
_project_root = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task, TaskStatus
from app.models.agent_log import AgentLog
from app.models.user import User
from app.schemas.agent import AgentExecuteRequest, AgentLogResponse

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/execute")
async def execute_agent(
    req: AgentExecuteRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Task).where(Task.id == req.task_id, Task.user_id == user.id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = TaskStatus.RUNNING
    await db.flush()

    try:
        from agent.engine import AgentEngine
        engine = AgentEngine()
        output = await engine.execute(req.agent_type, req.input, req.project_context)

        task.output = output
        task.status = TaskStatus.COMPLETED

        log = AgentLog(
            task_id=task.id,
            agent_name=req.agent_type,
            action="execute",
            input=req.input,
            output=output,
            tokens_used=0,
        )
        db.add(log)
        await db.flush()

        return {"task_id": str(task.id), "status": "completed", "output": output}
    except Exception as e:
        task.status = TaskStatus.FAILED
        task.error_message = str(e)
        await db.flush()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs/{task_id}", response_model=list[AgentLogResponse])
async def get_agent_logs(
    task_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AgentLog).where(AgentLog.task_id == task_id).order_by(AgentLog.created_at)
    )
    logs = result.scalars().all()
    return [AgentLogResponse.model_validate(log) for log in logs]
