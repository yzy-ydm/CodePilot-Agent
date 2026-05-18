# Changelog

## [1.0.0] - 2026-05-18

### Added
- 项目初始化：Monorepo 结构（frontend + backend + agent）
- 用户系统：注册/登录 (JWT)、用户信息接口
- 项目管理：CRUD 完整 API
- 任务系统：创建/查看/删除 AI 任务
- 多 Agent 引擎：Planner、Coder、Debug、Report 四个 Agent
- Agent 工作流：Planner → Coder → Debug → Report 全流程
- Claude API 集成：通过 Anthropic SDK
- Mock 模式：无 API Key 时可返回占位响应
- 前端：React 18 + TypeScript + Vite + TailwindCSS
- 前端页面：登录、仪表盘、Agent 交互、项目管理
- 状态管理：Zustand + React Query
- 数据库：PostgreSQL + SQLAlchemy 2.0 (async)
- 数据库初始化脚本和 Alembic 迁移
- Docker Compose：PostgreSQL + Redis + Backend + Frontend + Nginx + Celery
- Nginx 反向代理配置
- GitHub Actions CI/CD：测试 + 构建流水线
- API 文档（Swagger UI 自动生成）
- 后端测试：认证、项目、任务 API 测试
- 前端测试：基础组件测试
- README、API 文档、部署文档
- .env.example 环境变量模板
