"""
metrics.py

Structured observability logger for AI pipeline calls.

Logs every AIMetrics object to stdout as structured JSON, following the
AAD-01 Section 14 observability contract. Ready to be extended with a
Firestore or Cloud Logging sink in a future sprint.
"""
import json

from app.ai.models.ai_response import AIMetrics
from app.core.logging import logger


def log_ai_metrics(
    request_id: str,
    submission_id: str,
    stage: str,
    metrics: AIMetrics,
) -> None:
    """
    Emit a structured observability log line for a single AI gateway call.

    Args:
        request_id:    BAD-01 request ID from the HTTP middleware.
        submission_id: Firestore submission document ID.
        stage:         Pipeline stage name (e.g. "stage1_normalize").
        metrics:       AIMetrics recorded by the gateway for this call.
    """
    record = {
        "event": "ai_call",
        "requestId": request_id,
        "submissionId": submission_id,
        "stage": stage,
        "model": metrics.model,
        "promptVersion": metrics.prompt_version,
        "latencyMs": metrics.latency_ms,
        "inputTokens": metrics.input_tokens,
        "outputTokens": metrics.output_tokens,
        "estimatedCostUsd": metrics.estimated_cost_usd,
        "success": metrics.success,
        "failureReason": metrics.failure_reason,
    }
    if metrics.success:
        logger.info(f"[AI Observability] {json.dumps(record)}")
    else:
        logger.error(f"[AI Observability] {json.dumps(record)}")


def build_metrics_dict(metrics: AIMetrics) -> dict:
    """
    Serialize an AIMetrics object to a plain dict for Firestore persistence.
    """
    return metrics.model_dump()
