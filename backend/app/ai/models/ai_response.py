"""
AI response models: AIMetrics and AIResponse.

Every gateway call returns an AIResponse wrapping both the parsed output
and the observability metrics recorded during the call.
"""
from pydantic import BaseModel


class AIMetrics(BaseModel):
    """
    Observability envelope recorded for every Gemini call.

    Follows the AAD-01 Section 14 (AI Observability) contract:
    model, prompt version, latency, token counts, estimated cost.
    """
    model: str
    prompt_version: str
    latency_ms: float
    input_tokens: int | None = None
    output_tokens: int | None = None
    estimated_cost_usd: float | None = None
    success: bool
    failure_reason: str | None = None


class AIResponse(BaseModel):
    """
    Unified response returned by every gateway call.

    The `parsed` field holds the validated Python dict extracted from
    the Gemini JSON response. The `raw` field preserves the original
    string for debugging.
    """
    raw: str
    parsed: dict
    metrics: AIMetrics
