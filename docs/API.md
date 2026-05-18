# CodePilot Agent API 文档

Base URL: `http://localhost:8000/api/v1`

## 认证

所有 API（除注册/登录/健康检查外）需要在请求头中携带 JWT Token：

```
Authorization: Bearer <access_token>
```

---

## Auth 认证

### POST /auth/register

注册新用户。

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /auth/login

用户登录。

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):** 同上 register

### GET /auth/me

获取当前用户信息。

**Response (200):** UserResponse

---

## Projects 项目

### GET /projects/

获取用户的所有项目。

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "在线图书管理系统",
    "description": "毕设项目",
    "project_type": "graduation",
    "status": "in_progress",
    "task_count": 5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
]
```

### POST /projects/

创建新项目。

**Request:**
```json
{
  "name": "项目名称",
  "description": "项目描述",
  "project_type": "graduation"
}
```

project_type 可选值: `graduation`, `course`, `personal`, `other`

### GET /projects/{project_id}

获取项目详情。

### PUT /projects/{project_id}

更新项目信息。

**Request:**
```json
{
  "name": "新名称",
  "description": "新描述",
  "status": "in_progress"
}
```

### DELETE /projects/{project_id}

删除项目。返回 204。

---

## Tasks 任务

### GET /tasks/

获取用户的所有任务。

### POST /tasks/

创建新任务。

**Request:**
```json
{
  "project_id": "uuid (optional)",
  "agent_type": "planner",
  "title": "任务标题",
  "input": "任务描述/需求"
}
```

agent_type 可选值: `planner`, `coder`, `debug`, `report`

### GET /tasks/{task_id}

获取任务详情。

### DELETE /tasks/{task_id}

删除任务。返回 204。

---

## Agents AI 代理

### POST /agents/execute

执行 AI Agent。

**Request:**
```json
{
  "task_id": "uuid",
  "agent_type": "planner",
  "input": "用户需求描述",
  "project_context": "可选的项目上下文"
}
```

**Response (200):**
```json
{
  "task_id": "uuid",
  "status": "completed",
  "output": "Agent 输出内容（Markdown 格式）"
}
```

### GET /agents/logs/{task_id}

获取任务的 Agent 执行日志。

---

## Health Check

### GET /health

**Response (200):**
```json
{
  "status": "ok",
  "app": "CodePilot-Agent",
  "version": "1.0.0"
}
```
