# Screenshots

运行项目后，截取以下页面放入此目录：

| 文件名 | 页面 | 截图内容 |
|--------|------|----------|
| login.png | 登录页 | 登录表单界面 |
| dashboard.png | 仪表盘 | 项目统计 + 快速操作 |
| agent.png | Agent 交互 | AI Agent 对话界面 |
| projects.png | 项目管理 | 项目列表页面 |
| swagger.png | API 文档 | Swagger UI 界面 |
| tests.png | 测试结果 | pytest 14 passed 终端截图 |

## 截图方法

1. 确保项目正在运行：`cd backend && uvicorn app.main:app` + `cd frontend && npm run dev`
2. 使用截图工具（系统自带或 Snipaste）截取
3. 保存为 PNG 格式，放入此目录
4. 提交到 Git：`git add docs/screenshots/*.png`
