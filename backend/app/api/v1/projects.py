from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).where(Project.user_id == user.id).order_by(Project.updated_at.desc())
    )
    projects = result.scalars().all()

    response = []
    for p in projects:
        count_result = await db.execute(
            select(func.count(Task.id)).where(Task.project_id == p.id)
        )
        task_count = count_result.scalar() or 0
        response.append(
            ProjectResponse(
                id=p.id,
                user_id=p.user_id,
                name=p.name,
                description=p.description,
                project_type=p.project_type,
                status=p.status,
                task_count=task_count,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )
    return response


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    project = Project(user_id=user.id, **data.model_dump())
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return ProjectResponse(
        id=project.id, user_id=project.user_id, name=project.name,
        description=project.description, project_type=project.project_type,
        status=project.status, task_count=0,
        created_at=project.created_at, updated_at=project.updated_at,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user.id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    count_result = await db.execute(select(func.count(Task.id)).where(Task.project_id == project.id))
    task_count = count_result.scalar() or 0
    return ProjectResponse(
        id=project.id, user_id=project.user_id, name=project.name,
        description=project.description, project_type=project.project_type,
        status=project.status, task_count=task_count,
        created_at=project.created_at, updated_at=project.updated_at,
    )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user.id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    await db.flush()
    await db.refresh(project)

    count_result = await db.execute(select(func.count(Task.id)).where(Task.project_id == project.id))
    task_count = count_result.scalar() or 0
    return ProjectResponse(
        id=project.id, user_id=project.user_id, name=project.name,
        description=project.description, project_type=project.project_type,
        status=project.status, task_count=task_count,
        created_at=project.created_at, updated_at=project.updated_at,
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user.id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
