# CodePilot Agent — 项目架构文档

## 系统架构总览

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (Port 80)                     │
│              反向代理 + 静态资源服务                       │
└─────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│   Frontend       │          │   Backend        │
│   React 18 + TS  │◄────────►│   FastAPI        │
│   Vite :5173     │   REST   │   :8000          │
└──────────────────┘          └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │  PostgreSQL   │  │    Redis     │  │  Agent       │
          │  :5432        │  │    :6379     │  │  Engine      │
          └──────────────┘  └──────────────┘  └──────┬───────┘
                                                     │
                                              ┌──────▼───────┐
                                              │  Claude API  │
                                              │  (Anthropic)  │
                                              └──────────────┘
```

## 技术选型理由

| 组件 | 选型 | 理由 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | 生态最大，TypeScript 类型安全 |
| 构建工具 | Vite | 极速 HMR，原生 ESM |
| CSS | TailwindCSS | 原子化 CSS，快速开发 |
| 路由 | React Router v6 | 标准 React 路由方案 |
| 状态管理 | Zustand + React Query | 轻量且高效 |
| 后端框架 | FastAPI | 异步原生支持，自动 OpenAPI 文档 |
| ORM | SQLAlchemy 2.0 (async) | 成熟稳定，支持异步 |
| 数据库 | PostgreSQL / SQLite | 生产用 PG，开发用 SQLite |
| AI 引擎 | Anthropic SDK + LangChain | 200K 上下文，Agent 工作流 |
| 任务队列 | Celery + Redis | 异步执行长时间 AI 任务 |
| 部署 | Docker Compose + Nginx | 一键启动，反向代理 |

## 数据流设计

```
用户操作 → React UI → Axios API Client
                         │
                    REST JSON
                         │
                         ▼
              FastAPI Router Layer
                         │
                    Pydantic 验证
                         │
                   ┌─────┴─────┐
                   ▼           ▼
              Service      Agent
              Layer        Engine
                   │           │
              SQLAlchemy   Claude API
                   │
              PostgreSQL/SQLite
```

## 模块依赖关系

```
frontend/
├── pages/         → 依赖 components/, hooks/, services/, stores/
├── components/    → 依赖 hooks/, types/
├── services/      → 依赖 types/ (axios 封装)
├── stores/        → 依赖 services/, types/
└── hooks/         → 依赖 stores/

backend/
├── api/v1/        → 依赖 schemas/, core/deps.py, models/
├── core/          → 依赖 config (独立模块)
├── models/        → 依赖 db/session.py
├── schemas/       → 独立模块 (Pydantic)
├── services/      → 依赖 models/, core/
└── db/            → 依赖 core/config

agent/
├── agents/        → 依赖 prompts/, tools/, anthropic SDK
├── engine.py      → 依赖 agents/
├── prompts/       → 独立模块
└── workflows/     → 依赖 engine.py
```

## 数据库 ER 图

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│   users  │       │ projects │       │   tasks  │       │agent_logs│
├──────────┤       ├──────────┤       ├──────────┤       ├──────────┤
│ id (PK)  │──┐    │ id (PK)  │──┐    │ id (PK)  │──┐    │ id (PK)  │
│ email    │  │    │ user_id  │◄─┘    │ user_id  │◄─┘    │ task_id  │◄─┐
│ username │  │    │ name     │       │ proj_id  │──┐    │ agt_name │  │
│ password │  │    │ desc     │       │ agt_type │  │    │ action   │  │
│ role     │  │    │ type     │       │ title    │  │    │ input    │  │
│ active   │  │    │ status   │       │ input    │  │    │ output   │  │
│ created  │  │    │ created  │       │ output   │  │    │ tokens   │  │
│ updated  │  │    │ updated  │       │ status   │  │    │ created  │  │
└──────────┘  │    └──────────┘       │ error    │  │    └──────────┘
              │                       │ tokens   │  │
              └───────────────────────┤ created  │  │
                                      │ updated  │  │
                                      └──────────┘  │
                                                     │
    ┌────────────────────────────────────────────────┘
    │ (projects 表的 user_id FK)
    │ (tasks 表的 user_id FK)
    │ (tasks 表的 project_id FK)
    │ (agent_logs 表的 task_id FK)

Relationships:
  User 1──N Project  (user_id FK)
  User 1──N Task     (user_id FK)
  Project 1──N Task  (project_id FK, nullable)
  Task 1──N AgentLog (task_id FK)
```

## 安全设计

- **认证**: JWT (HS256)，Access Token 默认 60 分钟过期
- **密码**: bcrypt 加盐哈希
- **CORS**: FastAPI CORSMiddleware 白名单
- **SQL 注入防护**: SQLAlchemy ORM 参数化查询
- **XSS 防护**: React 默认转义 + CSP 头
- **CSRF**: JWT Bearer 方案（不依赖 Cookie）
