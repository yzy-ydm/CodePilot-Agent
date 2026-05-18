import os
from abc import ABC, abstractmethod
from anthropic import Anthropic

from app.core.config import settings


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", ""))

    @abstractmethod
    def system_prompt(self) -> str:
        pass

    async def run(self, input_text: str, context: str = "") -> str:
        if not self.client.api_key:
            return self._mock_response(input_text, context)

        try:
            message = self.client.messages.create(
                model=settings.CLAUDE_MODEL,
                max_tokens=4096,
                system=self.system_prompt(),
                messages=[
                    {"role": "user", "content": f"Context:\n{context}\n\nTask:\n{input_text}"}
                ],
            )
            return message.content[0].text
        except Exception as e:
            return f"[{self.name}] Error: {str(e)}"

    def _mock_response(self, input_text: str, context: str = "") -> str:
        return f"[{self.name} Agent - Mock Mode]\nInput: {input_text[:200]}\n\nThis is a placeholder response. Set ANTHROPIC_API_KEY to enable AI-powered responses."
