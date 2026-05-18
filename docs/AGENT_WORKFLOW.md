# CodePilot Agent — Agent 工作流文档

## 多 Agent 架构

CodePilot Agent 采用 **顺序协作式** 多 Agent 架构，4 个专业 Agent 按序执行：

```
┌──────────────────────────────────────────────────────┐
│                  用户输入需求                          │
└──────────────────────┬───────────────────────────────┘
                       ▼
          ┌─────────────────────────┐
          │   Planner Agent         │
          │   任务规划与分解          │
          │   输入: 需求描述          │
          │   输出: 结构化任务计划     │
          └────────────┬────────────┘
                       ▼
          ┌─────────────────────────┐
          │   Coder Agent           │
          │   代码生成               │
          │   输入: Planner 输出     │
          │   输出: 多文件代码        │
          └────────────┬────────────┘
                       ▼
          ┌─────────────────────────┐
          │   Debug Agent           │
          │   代码审查与修复          │
          │   输入: Coder 输出       │
          │   输出: 修复建议 + 代码   │
          └────────────┬────────────┘
                       ▼
          ┌─────────────────────────┐
          │   Report Agent          │
          │   文档与报告生成          │
          │   输入: 全部上下文        │
          │   输出: 文档/报告         │
          └────────────┬────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│                  最终交付物                            │
│   代码 + 文档 + 测试报告 + 部署说明                     │
└──────────────────────────────────────────────────────┘
```

## Agent 详细说明

### 1. Planner Agent (规划代理)

| 属性 | 说明 |
|------|------|
| **角色定位** | 需求分析与任务分解专家 |
| **核心能力** | 将模糊需求转化为可执行的步骤清单 |
| **输入** | 用户需求描述、项目上下文 |
| **输出** | 包含 3-7 个步骤的结构化计划，每步骤含目标/方案/技术栈/产出物/复杂度 |
| **调用方式** | 所有 Agent 流程的入口 |

**System Prompt 设计要点:**
- 分析核心目标
- 分解为具体可执行步骤
- 识别步骤间依赖关系
- 评估每个步骤的复杂度 (simple/medium/complex)

### 2. Coder Agent (编码代理)

| 属性 | 说明 |
|------|------|
| **角色定位** | 代码生成专家 |
| **核心能力** | 根据任务计划生成完整可运行代码 |
| **输入** | Planner 输出的任务计划 + 上下文 |
| **输出** | 多文件代码（含路径标记） |
| **调用方式** | 被 Planner 调用，在 Debug 前执行 |

**代码生成准则:**
- 生成完整可运行代码（无 TODO 或占位符）
- 包含必要的 import、配置、错误处理
- 遵循目标语言/框架最佳实践
- 多文件时用 `---` 分隔，标注文件路径

### 3. Debug Agent (调试代理)

| 属性 | 说明 |
|------|------|
| **角色定位** | 代码审查与安全审计专家 |
| **核心能力** | 检测 Bug、安全漏洞、性能问题 |
| **输入** | Coder 生成的代码 + 错误信息 |
| **输出** | 分类审查报告（Critical/Warnings/Suggestions）+ 修复代码 |
| **调用方式** | 在 Coder 输出后执行 |

**审查维度:**
1. 语法错误和逻辑 Bug
2. 安全漏洞（XSS、SQL 注入、硬编码密钥等）
3. 性能问题（N+1 查询、内存泄漏等）
4. 错误处理完整性
5. 边界条件处理
6. 代码质量建议

### 4. Report Agent (报告代理)

| 属性 | 说明 |
|------|------|
| **角色定位** | 文档与学术报告生成专家 |
| **核心能力** | 生成 README、实验报告、毕设论文章节 |
| **输入** | 全流程上下文（Plan + Code + Debug Result） |
| **输出** | 格式化的 Markdown 文档 |
| **调用方式** | 工作流最后一步 |

**文档类型:**
- `README.md` — 项目概览、安装、使用说明
- `实验报告` — 含背景、方法、结果、结论
- `毕设章节` — 结构化学术写作
- `API 文档` — 端点描述与示例
- `开发日志` — 开发过程记录

## 全工作流引擎

```python
# agent/engine.py — AgentEngine.execute_workflow()
async def execute_workflow(input_text, context):
    results = {}
    results["planner"] = await planner_agent.run(input_text, context)
    results["coder"] = await coder_agent.run(results["planner"], context)
    results["debug"] = await debug_agent.run(results["coder"], context)
    results["report"] = await report_agent.run(
        f"Plan + Code + Debug combined", context
    )
    return results
```

## Mock 模式

当未设置 `ANTHROPIC_API_KEY` 时，所有 Agent 自动切换为 Mock 模式，返回占位响应：

```
[planner Agent - Mock Mode]
Input: <用户输入的摘要>
This is a placeholder response. Set ANTHROPIC_API_KEY to enable AI-powered responses.
```

**切换方法:** 在 `.env` 中设置 `ANTHROPIC_API_KEY=sk-ant-...` 即可启用真实 AI 响应。

## 扩展性

通过继承 `BaseAgent` 可轻松添加新 Agent：

```python
class NewAgent(BaseAgent):
    def __init__(self):
        super().__init__("agent_name")

    def system_prompt(self) -> str:
        return "你的 Agent 角色描述..."
```
