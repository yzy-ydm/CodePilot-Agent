# CodePilot Agent — 项目总结

## 项目简介

CodePilot Agent 是一款面向大学生的 AI 驱动开发与毕业设计自动化平台，独立完成全栈架构设计、代码开发、测试编写和部署配置。项目采用四 Agent 协作架构（Planner → Coder → Debug → Report），将模糊的用户需求转化为结构化计划、可运行代码、审查报告和学术文档，实现从需求到交付的端到端自动化。

项目目前 88 个源文件、9,981 行代码、15 个 API 端点、14 个自动化测试（100% 通过），已在 GitHub 以 MIT 协议开源。

## 核心创新点

1. **多 Agent 协作架构**: 独创 Planner → Coder → Debug → Report 四阶段流水线，模拟真实软件工程团队协作
2. **面向大学生的垂直场景**: 精准切入毕业设计、课程项目、实验报告三大刚需，非通用代码助手
3. **离线 Mock 模式**: 无 API Key 也能展示完整 Demo，降低面试/答辩演示门槛
4. **SQLite/PostgreSQL 双模式**: 开发零配置即用 SQLite，生产无缝切换 PostgreSQL，一套代码
5. **全自动文档生成链**: Agent 可从需求一路生成代码→文档→报告，端到端交付

## 核心功能模块

| 模块 | 功能 |
|------|------|
| 用户系统 | 邮箱注册/登录，JWT 认证，用户面板 |
| 项目管理 | 毕设/课设/个人项目分类，全生命周期管理 |
| AI Agent | 4 个专业 Agent，Mock 模式免 Key 运行 |
| 任务系统 | 创建/执行/追踪 AI 任务，日志完整记录 |
| 代码生成 | Coder Agent 多文件代码产出 |
| 规划分解 | Planner Agent 将模糊需求拆解为可执行步骤 |
| 调试审查 | Debug Agent 自动检测 Bug/安全/性能问题 |
| 文档报告 | Report Agent 生成 README/实验报告/论文 |

## Agent 工作流

```
用户输入需求
     │
     ▼
┌──────────┐
│ Planner  │  需求分析 → 任务分解 → 技术方案
│  Agent   │  输出: 3-7 步结构化执行计划
└────┬─────┘
     ▼
┌──────────┐
│  Coder   │  根据计划生成代码
│  Agent   │  输出: 多文件完整可运行代码
└────┬─────┘
     ▼
┌──────────┐
│  Debug   │  代码审查 + 安全审计 + 性能分析
│  Agent   │  输出: 分级审查报告 + 修复代码
└────┬─────┘
     ▼
┌──────────┐
│  Report  │  文档生成 + 报告撰写
│  Agent   │  输出: README/实验报告/论文/API文档
└────┬─────┘
     ▼
  完整交付物
```

每个 Agent 均可独立调用，也可通过 `AgentEngine.execute_workflow()` 一键串联。所有 Agent 共享 Claude API 的 200K 上下文窗口。

## 技术架构

```
┌─────────────────────────────────────────┐
│              Nginx :80                  │
│         反向代理 + 静态资源             │
└─────────────────────────────────────────┘
                │
     ┌──────────┴──────────┐
     ▼                     ▼
┌──────────┐        ┌──────────┐
│ React 18 │◄──────►│ FastAPI  │
│ + TS     │  REST  │ + SQL   │
│ Vite     │  JSON  │ Alchemy  │
│ :5173    │        │ :8000    │
└──────────┘        └────┬─────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │PostgreSQL│  │  Redis   │  │  Agent   │
    │ /SQLite  │  │  :6379   │  │  Engine  │
    └──────────┘  └──────────┘  └────┬─────┘
                                     │
                              ┌──────▼──────┐
                              │  Claude API │
                              │ (Anthropic) │
                              └─────────────┘
```

### 技术栈明细

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | 生态最大，类型安全 |
| 构建 | Vite 5 | 极速 HMR，原生 ESM |
| UI | TailwindCSS 3 | 原子化 CSS，快速开发 |
| 状态 | Zustand + React Query | 轻量高效 |
| 后端 | FastAPI (async) | 自动 OpenAPI，异步支持 |
| ORM | SQLAlchemy 2.0 async | 成熟稳定 |
| AI | Anthropic SDK | 200K 上下文窗口 |
| 容器 | Docker Compose | 5 服务一键编排 |
| CI/CD | GitHub Actions | 自动测试+构建 |

## 项目亮点

1. **14/14 测试全过**: 覆盖认证/项目/任务三大模块，含异常场景
2. **15 个 API 端点**: RESTful 设计，Swagger 自动文档
3. **88 个源文件**: 不含 node_modules，纯净可审计
4. **一键启动**: `uvicorn` + `npm run dev` 两条命令即可跑通
5. **Docker 就绪**: `docker compose up -d` 一键生产部署
6. **类型安全**: TypeScript strict mode + Python 完整类型注解
7. **安全实践**: bcrypt 密码哈希、JWT 认证、CORS 白名单、SQL 注入防护
8. **Mock 模式**: 零依赖外部 API 即可演示完整功能流

## 测试结果总结

```
tests/test_auth.py::test_register             PASSED
tests/test_auth.py::test_register_duplicate   PASSED
tests/test_auth.py::test_login_success        PASSED
tests/test_auth.py::test_login_wrong_password PASSED
tests/test_auth.py::test_health               PASSED
tests/test_projects.py::test_create_project   PASSED
tests/test_projects.py::test_list_projects    PASSED
tests/test_projects.py::test_get_project      PASSED
tests/test_projects.py::test_delete_project   PASSED
tests/test_projects.py::test_unauthorized     PASSED
tests/test_tasks.py::test_create_task         PASSED
tests/test_tasks.py::test_list_tasks          PASSED
tests/test_tasks.py::test_get_task            PASSED
tests/test_tasks.py::test_delete_task         PASSED

14 passed in 37.08s — 100% 通过率
```

## 项目价值

| 维度 | 价值 |
|------|------|
| 学习价值 | 全栈项目最佳实践：React + FastAPI + Agent + Docker |
| 面试价值 | 完整架构设计 + 多 Agent + CI/CD，远超同级项目 |
| 答辩价值 | 可直接作为毕设成果，含完整文档和测试 |
| 作品集价值 | GitHub 88 文件公开仓库，Star/Fork 社交证明 |
| 持续开发 | 模块化架构，可扩展更多 Agent 和功能 |

## 使用场景

| 场景 | Agent 组合 | 产出 |
|------|-----------|------|
| 毕设开题 | Planner | 任务计划 + 技术方案 |
| 项目开发 | Planner → Coder → Debug | 完整可运行代码 |
| 论文撰写 | Report | 论文章节/实验报告 |
| 代码审查 | Debug | Bug 报告 + 修复建议 |
| 项目文档 | Report | README + API 文档 |

## 真实数据总览

### 代码规模

| 类别 | 数量 |
|------|------|
| 总文件 | **88** 个 (不含 node_modules) |
| Python | 44 个 / 1,287 行 |
| TypeScript/TSX | 16 个 / 1,074 行 |
| 文档 (Markdown) | 8 个 / 1,096 行 |
| 配置文件 | 14 个 (Docker/CI/Env/Config) |
| **总代码行数** | **9,981 行** |

### API 与数据

| 指标 | 数据 |
|------|------|
| API 端点 | **15** 个 (Auth 3 + Projects 5 + Tasks 4 + Agents 2 + Health 1) |
| 数据库表 | **4** 张 (users, projects, tasks, agent_logs) |
| Agent 数量 | **4** 个 (Planner, Coder, Debug, Report) |
| 测试用例 | **14** 个 (100% 通过) |

### 基础设施

| 组件 | 详情 |
|------|------|
| Docker 服务 | 5 个 (postgres + redis + backend + frontend + nginx) |
| CI/CD | GitHub Actions (test + typecheck + build) |
| 数据库 | PostgreSQL(生产) / SQLite(开发) 双模式 |

## 项目地址

**GitHub**: https://github.com/yzy-ydm/CodePilot-Agent
