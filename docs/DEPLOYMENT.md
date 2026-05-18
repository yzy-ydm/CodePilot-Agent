# CodePilot Agent — 部署文档

## 方式一: Docker Compose（推荐）

### 前置条件
- Docker Desktop 20+
- 磁盘空间 > 2GB

### 步骤

```bash
git clone https://github.com/your-username/codepilot-agent.git
cd codepilot-agent
cp .env.example .env
# 编辑 .env 填入 ANTHROPIC_API_KEY 和强密码 SECRET_KEY

docker compose up -d
# 5 个容器启动: postgres, redis, backend, frontend, nginx
```

### 访问

| 服务 | URL |
|------|-----|
| 前端 | http://localhost |
| 后端 API | http://localhost/api |
| Swagger 文档 | http://localhost/api/docs |
| Health Check | http://localhost/api/health |

### 管理

```bash
docker compose ps              # 查看状态
docker compose logs -f backend # 查看后端日志
docker compose restart backend # 重启后端
docker compose down            # 停止所有
docker compose down -v         # 停止 + 清除数据
```

---

## 方式二: 本地开发

### 后端

```bash
# Python 3.12+
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 默认使用 SQLite，无需安装 PostgreSQL
uvicorn app.main:app --reload --port 8000
# Swagger: http://localhost:8000/docs
```

### 前端

```bash
# Node.js 20+
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### 环境变量

```bash
cp .env.example .env
```

关键配置:
| 变量 | 说明 | 默认值 |
|------|------|--------|
| DATABASE_URL | 数据库连接串 | sqlite+aiosqlite:///./codepilot.db |
| SECRET_KEY | JWT 密钥 | (开发默认值) |
| ANTHROPIC_API_KEY | Claude API Key | (空=Mock 模式) |
| CORS_ORIGINS | 允许跨域域名 | localhost:5173 |

---

## 方式三: 生产部署

### 生产 checklist

1. **SECRET_KEY**: `openssl rand -hex 32` 生成强密钥
2. **HTTPS**: Nginx + Let's Encrypt
3. **数据库**: 使用 PostgreSQL，配置强密码
4. **CORS**: 限制为实际域名
5. **限流**: Nginx rate limiting 或 FastAPI middleware
6. **日志**: 配置 loguru 输出到文件
7. **监控**: 对接 Prometheus + Grafana
8. **备份**: 配置 PostgreSQL 自动备份

### 生产 docker-compose.override.yml

```yaml
services:
  backend:
    environment:
      DEBUG: "false"
      CORS_ORIGINS: "https://your-domain.com"
    restart: always

  nginx:
    volumes:
      - ./docker/nginx.prod.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    ports:
      - "80:80"
      - "443:443"
```
