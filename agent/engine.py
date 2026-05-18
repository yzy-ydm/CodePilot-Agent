from typing import Optional

from agent.agents.planner import PlannerAgent
from agent.agents.coder import CoderAgent
from agent.agents.debug import DebugAgent
from agent.agents.report import ReportAgent


class AgentEngine:
    def __init__(self):
        self._agents = {
            "planner": PlannerAgent(),
            "coder": CoderAgent(),
            "debug": DebugAgent(),
            "report": ReportAgent(),
        }

    async def execute(self, agent_type: str, input_text: str, context: Optional[str] = None) -> str:
        agent = self._agents.get(agent_type)
        if not agent:
            return f"Unknown agent type: {agent_type}. Available: {list(self._agents.keys())}"
        return await agent.run(input_text, context or "")

    async def execute_workflow(self, input_text: str, context: Optional[str] = None) -> dict:
        """Execute full multi-agent workflow: Planner -> Coder -> Debug -> Report"""
        results = {}

        plan = await self._agents["planner"].run(input_text, context or "")
        results["planner"] = plan

        code = await self._agents["coder"].run(plan, context or "")
        results["coder"] = code

        debug = await self._agents["debug"].run(code, context or "")
        results["debug"] = debug

        report = await self._agents["report"].run(
            f"Plan: {plan}\n\nCode: {code}\n\nDebug: {debug}",
            context or ""
        )
        results["report"] = report

        return results
