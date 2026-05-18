# CodePilot Agent

**AI 开发与毕业设计自动化平台**

面向大学生的 AI 驱动开发平台，提供代码生成、项目规划、毕设辅助、实验报告生成、文档生成、调试优化和多轮任务协同等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 18 + TypeScript + Vite + TailwindCSS |
| **后端** | Python FastAPI + SQLAlchemy 2.0 (async) |
| **数据库** | PostgreSQL 16 |
| **AI 引擎** | Claude API + LangChain + 自研 Agent 框架 |
| **任务队列** | Celery + Redis |
| **部署** | Docker Compose + Nginx |
| **CI/CD** | GitHub Actions |

## 功能模块

- **用户系统** — 注册/登录 (JWT)、用户面板
- **项目管理** — 创建/管理毕设、课设、个人项目
- **多 Agent 协作** — Planner → Coder → Debug → Report 工作流
- **代码生成** — AI 驱动的多文件代码生成
- **文档生成** — README、实验报告、毕设论文章节
- **调试审查** — 自动 Bug 检测、安全审查、性能优化

## 快速开始

### 环境要求

- Docker & Docker Compose
- Node.js 20+ (前端开发)
- Python 3.12+ (后端开发)

### 一键启动

```bash
# 克隆项目
git clone https://github.com/your-username/codepilot-agent.git
cd codepilot-agent

# 复制环境变量配置
cp .env.example .env
# 编辑 .env 填入你的 ANTHROPIC_API_KEY

# 启动所有服务
docker compose up -d
```

访问:
- 前端: http://localhost:5173
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 本地开发

**后端:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**前端:**
```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
codepilot-agent/
├── frontend/              # React 前端
│   ├── src/
│   │   ├── components/    # UI 组件
│   │   ├── pages/         # 页面路由
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── services/      # API 客户端
│   │   ├── stores/        # Zustand 状态
│   │   └── types/         # TS 类型
│   └── public/
├── backend/               # FastAPI 后端
│   ├── app/
│   │   ├── api/v1/        # API 路由
│   │   ├── core/          # 配置/安全
│   │   ├── models/        # ORM 模型
│   │   ├── schemas/       # Pydantic 模型
│   │   └── db/            # 数据库
│   └── tests/
├── agent/                 # AI Agent 引擎
│   ├── agents/            # 4 个 Agent
│   ├── workflows/         # 协作工作流
│   ├── prompts/           # Prompt 模板
│   └── tools/             # Agent 工具
├── database/              # SQL 脚本
├── docker/                # Docker 配置
├── docs/                  # 文档
└── .github/workflows/     # CI/CD
```

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| GET | /api/v1/auth/me | 获取当前用户 |
| GET | /api/v1/projects/ | 项目列表 |
| POST | /api/v1/projects/ | 创建项目 |
| GET | /api/v1/tasks/ | 任务列表 |
| POST | /api/v1/tasks/ | 创建任务 |
| POST | /api/v1/agents/execute | 执行 Agent |

## 多 Agent 架构

```
用户输入
   ↓
Planner Agent (任务分解)
   ↓
Coder Agent (代码生成)
   ↓
Debug Agent (审查修复)
   ↓
Report Agent (文档生成)
   ↓
用户获得完整交付
```

## License

MIT
