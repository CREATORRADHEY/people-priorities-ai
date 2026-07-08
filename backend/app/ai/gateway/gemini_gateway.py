"""
gemini_gateway.py

Concrete Gemini implementation of BaseAIGateway using the new google-genai SDK.

Responsibilities (as per AAD-01 Section 5):
  - Load and configure the Gemini model from settings.GEMINI_MODEL
  - Send prompts with configured temperature and token limits
  - Retry once on JSON parsing failure before raising ParsingException
  - Record latency, token counts, and estimated cost in AIMetrics
  - Never contain prompt logic — prompts arrive fully built from the pipeline
"""
import json
import time

from google import genai
from google.genai import types

from app.ai.exceptions import AIGatewayException, ParsingException
from app.ai.gateway.base_gateway import BaseAIGateway
from app.ai.models.ai_response import AIMetrics, AIResponse
from app.ai.utils.cost_estimator import estimate_cost, estimate_tokens_from_text
from app.ai.utils.json_validator import validate_response
from app.core.config import settings
from app.core.logging import logger

# Gemini generation config defaults
_TEMPERATURE: float = 0.2          # Low temperature for deterministic structured outputs
_MAX_OUTPUT_TOKENS: int = 1024
_MAX_RETRIES: int = 1              # Retry once on JSON parse failure


def _extract_json(text: str) -> dict:
    """
    Extract and parse a JSON object from a raw Gemini response string.

    Gemini may wrap JSON in markdown code fences — strip them first.

    Raises:
        ParsingException: If no valid JSON object can be extracted.
    """
    # Strip markdown fences if present
    stripped = text.strip()
    if stripped.startswith("```"):
        lines = stripped.splitlines()
        # Remove first line (```json or ```) and last line (```)
        inner = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
        stripped = inner.strip()

    try:
        return json.loads(stripped)
    except json.JSONDecodeError as exc:
        raise ParsingException(
            f"Cannot parse Gemini response as JSON: {exc}. Raw: {text[:300]}"
        ) from exc


class GeminiGateway(BaseAIGateway):
    """
    Gemini generative AI gateway using the new google-genai SDK.

    Uses settings.GEMINI_MODEL — never hardcodes a model name.
    """

    def __init__(self) -> None:
        self._model_name = settings.GEMINI_MODEL
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info(f"[GeminiGateway] Initialized with model: {self._model_name} (google-genai SDK)")

    async def generate(
        self,
        prompt: str,
        prompt_name: str,
        prompt_version: str,
        output_schema: dict,
    ) -> AIResponse:
        """
        Send prompt to Gemini and return a validated AIResponse.

        Retries once on JSON/schema failure before raising.
        """
        attempt = 0
        last_exc: Exception | None = None

        while attempt <= _MAX_RETRIES:
            start = time.monotonic()
            raw_text = ""
            input_tokens: int | None = None
            output_tokens: int | None = None

            try:
                logger.info(
                    f"[GeminiGateway] Sending prompt '{prompt_name}' "
                    f"(attempt {attempt + 1}/{_MAX_RETRIES + 1})"
                )

                response = self._client.models.generate_content(
                    model=self._model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=_TEMPERATURE,
                        max_output_tokens=_MAX_OUTPUT_TOKENS,
                        response_mime_type="application/json",
                    ),
                )
                raw_text = response.text

                latency_ms = (time.monotonic() - start) * 1000

                # Extract token usage if available from SDK metadata
                try:
                    usage = response.usage_metadata
                    if usage:
                        input_tokens = getattr(usage, "prompt_token_count", None)
                        output_tokens = getattr(usage, "candidates_token_count", None)
                except Exception:
                    pass  # Not all response types expose usage_metadata

                # Fallback token estimates
                if input_tokens is None:
                    input_tokens = estimate_tokens_from_text(prompt)
                if output_tokens is None:
                    output_tokens = estimate_tokens_from_text(raw_text)

                cost = estimate_cost(input_tokens, output_tokens, self._model_name)

                # Parse and validate JSON
                parsed = _extract_json(raw_text)
                validate_response(parsed, prompt_name)

                metrics = AIMetrics(
                    model=self._model_name,
                    prompt_version=prompt_version,
                    latency_ms=round(latency_ms, 2),
                    input_tokens=input_tokens,
                    output_tokens=output_tokens,
                    estimated_cost_usd=cost,
                    success=True,
                )
                logger.info(
                    f"[GeminiGateway] '{prompt_name}' completed in {latency_ms:.1f}ms"
                )
                return AIResponse(raw=raw_text, parsed=parsed, metrics=metrics)

            except (ParsingException,) as exc:
                last_exc = exc
                latency_ms = (time.monotonic() - start) * 1000
                logger.warning(
                    f"[GeminiGateway] Parse failure on attempt {attempt + 1} "
                    f"for '{prompt_name}': {exc}"
                )
                attempt += 1
                continue

            except Exception as exc:
                latency_ms = (time.monotonic() - start) * 1000
                
                # Check for 429 rate limit or quota errors to perform backoff retry
                exc_str = str(exc).upper()
                if "429" in exc_str or "RESOURCE_EXHAUSTED" in exc_str or "QUOTA" in exc_str:
                    quota_attempt = getattr(self, "_quota_retries", 0)
                    max_quota_retries = 3
                    if quota_attempt < max_quota_retries:
                        # Exponential backoff: 2s, 4s, 8s...
                        backoff_sec = 2 ** (quota_attempt + 1)
                        logger.warning(
                            f"[GeminiGateway] Rate limit hit (429/RESOURCE_EXHAUSTED) for '{prompt_name}'. "
                            f"Retrying in {backoff_sec} seconds... (Attempt {quota_attempt + 1}/{max_quota_retries})"
                        )
                        import asyncio
                        await asyncio.sleep(backoff_sec)
                        self._quota_retries = quota_attempt + 1
                        # Reset main loop attempt to retry this generation step
                        continue
                
                # Reset rate limit retry counter on other errors
                if hasattr(self, "_quota_retries"):
                    delattr(self, "_quota_retries")

                metrics = AIMetrics(
                    model=self._model_name,
                    prompt_version=prompt_version,
                    latency_ms=round(latency_ms, 2),
                    input_tokens=input_tokens,
                    output_tokens=output_tokens,
                    estimated_cost_usd=None,
                    success=False,
                    failure_reason=str(exc),
                )
                logger.error(
                    f"[GeminiGateway] Network/SDK error for '{prompt_name}': {exc}"
                )
                raise AIGatewayException(
                    f"Gemini API error for '{prompt_name}': {exc}"
                ) from exc

        # Reset rate limit retry counter on exhaust
        if hasattr(self, "_quota_retries"):
            delattr(self, "_quota_retries")

        # Exhausted retries
        raise ParsingException(
            f"Gemini response for '{prompt_name}' failed validation after "
            f"{_MAX_RETRIES + 1} attempts: {last_exc}"
        )
