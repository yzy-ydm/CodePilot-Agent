# CodePilot Agent — 接口文档

Base URL: `http://localhost:8000/api/v1`

## 通用说明

### 认证
所有需要认证的接口在 Header 中携带:
```
Authorization: Bearer <access_token>
```

### 错误码
| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 过期 |
| 404 | 资源不存在 |
| 409 | 冲突（如邮箱已注册） |
| 500 | 服务器内部错误 |

---

## Auth 认证

### POST /auth/register
注册新用户

**Body:**
```json
{
  "email": "user@example.com",
  "username": "string",
  "password": "string"
}
```
**Response (201):**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": { "id": "uuid", "email": "...", "username": "...", "role": "user" }
}
```

### POST /auth/login
用户登录

**Body:**
```json
{ "email": "user@example.com", "password": "string" }
```
**Response (200):** 同 register

### GET /auth/me
获取当前登录用户信息

**Response (200):** UserResponse

---

## Projects 项目管理

### GET /projects/
获取项目列表

**Response (200):**
```json
[
  {
    "id": "uuid", "user_id": "uuid",
    "name": "项目名称", "description": "...",
    "project_type": "graduation",
    "status": "in_progress", "task_count": 3,
    "created_at": "ISO8601", "updated_at": "ISO8601"
  }
]
```

### POST /projects/
创建项目

**Body:**
```json
{
  "name": "项目名称",
  "description": "描述（可选）",
  "project_type": "graduation|course|personal|other"
}
```
**Response (201):** ProjectResponse

### GET /projects/{id}
获取单个项目

**Response (200):** ProjectResponse

### PUT /projects/{id}
更新项目

**Body:** `{ "name?": "str", "description?": "str", "status?": "str" }`

**Response (200):** ProjectResponse

### DELETE /projects/{id}
删除项目

**Response (204):** No Content

---

## Tasks 任务管理

### GET /tasks/
获取任务列表

**Response (200):**
```json
[
  {
    "id": "uuid", "project_id": "uuid|null",
    "user_id": "uuid", "agent_type": "planner",
    "title": "任务标题", "input": "...",
    "output": "...|null", "status": "pending|running|completed|failed",
    "error_message": "...|null", "tokens_used": 0,
    "created_at": "ISO8601", "updated_at": "ISO8601"
  }
]
```

### POST /tasks/
创建任务

**Body:**
```json
{
  "project_id": "uuid|null",
  "agent_type": "planner|coder|debug|report",
  "title": "任务标题（可选）",
  "input": "任务需求描述"
}
```
**Response (201):** TaskResponse

### GET /tasks/{id}
获取单个任务

### DELETE /tasks/{id}
删除任务。Response (204)

---

## Agents AI 代理

### POST /agents/execute
执行 AI Agent

**Body:**
```json
{
  "task_id": "uuid",
  "agent_type": "planner",
  "input": "需求描述",
  "project_context": "可选上下文"
}
```

**Response (200):**
```json
{
  "task_id": "uuid",
  "status": "completed",
  "output": "Agent 输出内容 (Markdown)"
}
```

### GET /agents/logs/{task_id}
获取某任务的执行日志

**Response (200):**
```json
[
  {
    "id": "uuid", "task_id": "uuid",
    "agent_name": "planner", "action": "execute",
    "input": "...", "output": "...",
    "tokens_used": 0, "created_at": "ISO8601"
  }
]
```

---

## Health

### GET /health
健康检查

**Response (200):**
```json
{ "status": "ok", "app": "CodePilot-Agent", "version": "1.0.0" }
```
