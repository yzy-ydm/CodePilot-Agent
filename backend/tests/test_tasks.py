import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, auth_headers: dict):
    response = await client.post("/api/v1/tasks/", json={
        "agent_type": "planner",
        "title": "测试任务",
        "input": "创建一个在线图书管理系统",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["agent_type"] == "planner"
    assert data["status"] == "pending"
    assert data["input"] == "创建一个在线图书管理系统"


@pytest.mark.asyncio
async def test_list_tasks(client: AsyncClient, auth_headers: dict):
    await client.post("/api/v1/tasks/", json={"agent_type": "coder", "input": "Task 1"}, headers=auth_headers)
    await client.post("/api/v1/tasks/", json={"agent_type": "debug", "input": "Task 2"}, headers=auth_headers)

    response = await client.get("/api/v1/tasks/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_task(client: AsyncClient, auth_headers: dict):
    create_resp = await client.post("/api/v1/tasks/", json={
        "agent_type": "report",
        "title": "文档任务",
        "input": "生成项目 README",
    }, headers=auth_headers)
    task_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "文档任务"


@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, auth_headers: dict):
    create_resp = await client.post("/api/v1/tasks/", json={
        "agent_type": "planner",
        "input": "待删除",
    }, headers=auth_headers)
    task_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 204
