# CodePilot Agent 部署文档

## Docker Compose 部署（推荐）

### 1. 环境准备

```bash
# 安装 Docker & Docker Compose
# https://docs.docker.com/get-docker/

# 克隆项目
git clone https://github.com/your-username/codepilot-agent.git
cd codepilot-agent
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要配置
```

必须配置的变量:
- `ANTHROPIC_API_KEY` — Claude API 密钥
- `SECRET_KEY` — JWT 签名密钥（生产环境需更换）

### 3. 启动服务

```bash
# 构建并启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f backend
```

### 4. 访问

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost |
| 后端 API | http://localhost/api |
| Swagger 文档 | http://localhost/api/docs |
| PgAdmin (可选) | http://localhost:5050 |

### 5. 停止服务

```bash
docker compose down

# 同时删除数据卷
docker compose down -v
```

---

## 手动部署

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 配置 .env
cp ../.env.example ../.env

# 数据库迁移
alembic upgrade head

# 启动
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run build

# 使用 Nginx 部署 dist/ 目录
# 或使用 npm run preview 预览
```

### Celery Worker（可选，用于异步任务）

```bash
cd backend
celery -A app.tasks.celery_app worker --loglevel=info
```

---

## 生产环境注意事项

1. **更换 SECRET_KEY** — 使用 `openssl rand -hex 32` 生成
2. **配置 HTTPS** — 使用 Nginx + Let's Encrypt
3. **数据库密码** — 使用强密码
4. **CORS** — 限制允许的域名
5. **限流** — 添加 rate limiting
6. **日志** — 配置日志收集（如 ELK）
7. **监控** — 添加健康检查和告警

---

## 环境变量参考

| 变量 | 默认值 | 说明 |
|------|--------|------|
| POSTGRES_USER | codepilot | 数据库用户 |
| POSTGRES_PASSWORD | codepilot_secret | 数据库密码 |
| POSTGRES_DB | codepilot | 数据库名 |
| DATABASE_URL | - | 数据库连接串 |
| SECRET_KEY | - | JWT 密钥 |
| ANTHROPIC_API_KEY | - | Claude API Key |
| CORS_ORIGINS | localhost:5173 | 允许的跨域域名 |
| REDIS_URL | redis://localhost:6379/0 | Redis 地址 |
