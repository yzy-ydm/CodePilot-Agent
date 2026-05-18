import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, auth_headers: dict):
    response = await client.post("/api/v1/projects/", json={
        "name": "测试项目",
        "description": "这是一个测试项目",
        "project_type": "graduation",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "测试项目"
    assert data["project_type"] == "graduation"
    assert data["status"] == "draft"
    assert data["task_count"] == 0


@pytest.mark.asyncio
async def test_list_projects(client: AsyncClient, auth_headers: dict):
    await client.post("/api/v1/projects/", json={"name": "P1"}, headers=auth_headers)
    await client.post("/api/v1/projects/", json={"name": "P2"}, headers=auth_headers)

    response = await client.get("/api/v1/projects/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_project(client: AsyncClient, auth_headers: dict):
    create_resp = await client.post("/api/v1/projects/", json={"name": "测试"}, headers=auth_headers)
    project_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "测试"


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient, auth_headers: dict):
    create_resp = await client.post("/api/v1/projects/", json={"name": "待删除"}, headers=auth_headers)
    project_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 204

    response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/projects/")
    assert response.status_code == 401
