# Changelog

## [1.0.1] - 2026-05-19

### Fixed

- bcrypt 5.x 兼容性: 用 `bcrypt` 直接替换 `passlib.CryptContext`
- Python 3.13 兼容: 修复 `datetime.utcnow()` 弃用警告，改用 `datetime.now(timezone.utc)`
- SQLite UUID 兼容: 将 `postgresql.UUID` 替换为通用 `sqlalchemy.Uuid` 类型
- 数据库引擎: 添加 SQLite `check_same_thread=False` 参数支持
- 模型加载: 在 `main.py` 中预加载所有模型，修复关系解析错误
- Agent 模块路径: 添加项目根目录到 `sys.path`，修复 agent 引擎导入
- 测试数据库: 修复测试隔离问题，通过 `dependency_overrides` 注入测试引擎
- 测试预期值: 修正 `test_unauthorized` 期望状态码 403→401
- Pydantic V2 弃用: 将 `class Config` 替换为 `model_config = ConfigDict(from_attributes=True)`
- 依赖列表: 移除不可安装的 `psycopg2-binary`，添加 `aiosqlite`

### Changed

- 数据库默认使用 SQLite (零配置开发模式)，可通过 `.env` 切换 PostgreSQL
- 环境变量检查: 启动时不依赖 Docker/PostgreSQL 即可运行
- 后端不再要求外部数据库，降低开发门槛

### Added

- SQLite 开发模式: 首次启动自动创建 4 张表
- `pyproject.toml`: pytest 异步配置 `asyncio_mode = "auto"`
- `docs/PROJECT_SUMMARY.md`: 项目展示材料

## [1.0.0] - 2026-05-18

### Added

- 项目初始化：Monorepo 结构 (frontend + backend + agent)
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
