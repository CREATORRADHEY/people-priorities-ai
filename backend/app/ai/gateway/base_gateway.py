"""
base_gateway.py

Abstract contract for the AI gateway.

The gateway is the ONLY layer allowed to call Gemini (per AAD-01 Section 5).
No classification, scoring, or pipeline code may call the Gemini SDK directly.
"""
from abc import ABC, abstractmethod

from app.ai.models.ai_response import AIResponse


class BaseAIGateway(ABC):
    """
    Abstract AI gateway interface.

    Implementations receive a fully-built prompt string and return an
    AIResponse containing both the parsed output and observability metrics.
    """

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        prompt_name: str,
        prompt_version: str,
        output_schema: dict,
    ) -> AIResponse:
        """
        Send the prompt to the AI model and return a structured response.

        Args:
            prompt:         The complete, variable-injected prompt string.
            prompt_name:    Human-readable name for observability logging.
            prompt_version: Version string from the prompt manifest.
            output_schema:  JSON schema dict used to validate the response.

        Returns:
            AIResponse with parsed output and populated AIMetrics.

        Raises:
            AIGatewayException: On network error, timeout, or exhausted retries.
            ParsingException:   If the response cannot be parsed as valid JSON.
        """
        ...
