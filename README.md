# CodePilot Agent

**AI 开发与毕业设计自动化平台**

面向大学生的 AI 驱动开发平台，四 Agent 协作架构（Planner → Coder → Debug → Report），实现从需求到代码到文档的端到端自动化。

[![Tests](https://img.shields.io/badge/tests-14%2F14%20passed-brightgreen)](https://github.com/yzy-ydm/CodePilot-Agent/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12%2B-3776AB)](https://python.org)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED)](https://docker.com)

## 项目数据

| 数据 | 数据 |
|------|------|
| 源文件 | **88** 个 |
| 代码行数 | **9,981** 行 |
| API 端点 | **15** 个 |
| Agent 数量 | **4** 个 |
| 数据库表 | **4** 张 |
| 测试用例 | **14/14** 通过 |

## 截图

> 运行项目并截图后，将图片放入 `docs/screenshots/` 目录。

| 页面 | 截图位置 |
|------|----------|
| 登录页 | `docs/screenshots/login.png` |
| 仪表盘 | `docs/screenshots/dashboard.png` |
| AI Agent 交互 | `docs/screenshots/agent.png` |
| 项目管理 | `docs/screenshots/projects.png` |
| API Swagger | `docs/screenshots/swagger.png` |
| 测试结果 | `docs/screenshots/tests.png` |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + TailwindCSS |
| 状态管理 | Zustand + React Query |
| 后端 | FastAPI (async) + SQLAlchemy 2.0 (async) |
| 数据库 | PostgreSQL 16 (生产) / SQLite (开发) |
| AI 引擎 | Anthropic SDK + 自研多 Agent 框架 |
| 任务队列 | Celery + Redis |
| 部署 | Docker Compose + Nginx |
| CI/CD | GitHub Actions |

## 快速开始

### 方式一：本地开发（零配置）

```bash
git clone https://github.com/yzy-ydm/CodePilot-Agent.git
cd CodePilot-Agent
cp .env.example .env

# 终端 1: 后端 (默认 SQLite，无需数据库)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 终端 2: 前端
cd frontend
npm install
npm run dev
```

### 方式二：Docker Compose（一键部署）

```bash
cp .env.example .env
# 编辑 .env 填入 ANTHROPIC_API_KEY
docker compose up -d
```

### 访问

| 服务 | 地址 |
|------|------|
| 前端 UI | http://localhost:5173 |
| 后端 API | http://localhost:8000 |
| Swagger 文档 | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

## API 端点

### Auth (认证)
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/register` | 用户注册 |
| POST | `/api/v1/auth/login` | 用户登录 |
| GET | `/api/v1/auth/me` | 当前用户信息 |

### Projects (项目管理)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/projects/` | 项目列表 |
| POST | `/api/v1/projects/` | 创建项目 |
| GET | `/api/v1/projects/{id}` | 项目详情 |
| PUT | `/api/v1/projects/{id}` | 更新项目 |
| DELETE | `/api/v1/projects/{id}` | 删除项目 |

### Tasks (任务管理)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/tasks/` | 任务列表 |
| POST | `/api/v1/tasks/` | 创建任务 |
| GET | `/api/v1/tasks/{id}` | 任务详情 |
| DELETE | `/api/v1/tasks/{id}` | 删除任务 |

### Agents (AI 代理)
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/agents/execute` | 执行 Agent |
| GET | `/api/v1/agents/logs/{task_id}` | Agent 执行日志 |

## 多 Agent 工作流

```
用户需求
    │
    ▼
┌──────────┐  需求分析 + 任务分解
│ Planner  │  → 3-7 步结构化计划
└────┬─────┘
     ▼
┌──────────┐  代码生成
│  Coder   │  → 多文件完整代码
└────┬─────┘
     ▼
┌──────────┐  代码审查 + 安全审计
│  Debug   │  → 分级审查报告
└────┬─────┘
     ▼
┌──────────┐  文档 + 报告生成
│  Report  │  → README/论文/实验报告
└────┬─────┘
     ▼
  完整交付
```

Mock 模式：未配置 `ANTHROPIC_API_KEY` 时自动返回占位响应，项目可完整演示。

## 项目结构

```
CodePilot-Agent/
├── frontend/                 # React 前端
│   └── src/
│       ├── components/       # Navbar / Sidebar
│       ├── pages/            # Login / Dashboard / Agent / Projects
│       ├── hooks/            # useAuth
│       ├── services/         # Axios API 客户端
│       ├── stores/           # Zustand 状态管理
│       └── types/            # TypeScript 类型定义
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── api/v1/           # 4 个路由模块 (15 端点)
│   │   ├── core/             # config / security / deps
│   │   ├── models/           # 4 个 ORM 模型
│   │   ├── schemas/          # Pydantic 请求/响应模型
│   │   └── db/               # session / base
│   └── tests/                # 14 个自动化测试
├── agent/                    # AI Agent 引擎
│   ├── agents/               # 4 个 Agent (Planner/Coder/Debug/Report)
│   ├── workflows/            # 多 Agent 协作编排
│   ├── prompts/              # System Prompt 模板
│   └── tools/                # Agent 工具集
├── database/                 # PostgreSQL 初始化 SQL
├── docker/                   # Dockerfiles + Nginx 配置
├── docs/                     # 8 份项目文档
└── .github/workflows/        # CI/CD 流水线
```

## 测试

```bash
cd backend
pytest tests/ -v
```

```
14 passed in 37.08s — 100% 通过率
test_register ✓  test_register_duplicate ✓  test_login_success ✓
test_login_wrong_password ✓  test_health ✓  test_create_project ✓
test_list_projects ✓  test_get_project ✓  test_delete_project ✓
test_unauthorized ✓  test_create_task ✓  test_list_tasks ✓
test_get_task ✓  test_delete_task ✓
```

## 文档

| 文档 | 说明 |
|------|------|
| [README.md](README.md) | 项目总览与快速开始 |
| [PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) | 项目总结与展示材料 |
| [PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md) | 系统架构文档 |
| [AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md) | Agent 工作流详解 |
| [API_DOC.md](docs/API_DOC.md) | API 接口文档 |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | 部署文档 |
| [CHANGELOG.md](CHANGELOG.md) | 变更日志 |

## License

MIT — Copyright (c) 2026
