"""
analysis_pipeline.py

Two-stage AI analysis pipeline orchestrator.

Stage 1 – Normalize:
    Detects language and extracts a clean English summary.
    Output: { summary, language, translatedText }

Stage 2 – Reason:
    Classifies the issue, extracts themes, assigns confidence,
    and generates an MP recommendation.
    Output: { category, themes, confidence, recommendation, reasoning }

The pipeline:
  1. Persists every state transition to Firestore (not only COMPLETED/FAILED).
  2. Flows a typed PipelineContext through all stages — no dict passing.
  3. Applies a confidence threshold to set the Human Review Layer flag.
  4. Wraps all failures in AI-specific exceptions before returning.
"""
import datetime
import uuid

from app.ai.exceptions import AIGatewayException, ParsingException, PipelineException
from app.ai.gateway.base_gateway import BaseAIGateway
from app.ai.gateway.gateway_factory import get_gateway
from app.ai.models.analysis import AnalysisResult, PipelineContext
from app.ai.pipeline.pipeline_result import PipelineResult
from app.ai.pipeline.pipeline_state import PipelineState
from app.ai.repositories.base_analysis_repository import (
    BaseAnalysisRepository,
    AnalysisDatabaseException,
)
from app.ai.utils.json_validator import validate_response, STAGE1_SCHEMA, STAGE2_SCHEMA
from app.ai.utils.metrics import log_ai_metrics, build_metrics_dict
from app.ai.utils.prompt_builder import build_prompt
from app.ai.utils.prompt_loader import load_prompt_template, get_prompt_version_from_manifest
from app.core.logging import logger

# Human Review threshold (from tech lead recommendation)
_REVIEW_THRESHOLD: float = 0.85

# Active prompt version
_PROMPT_VERSION = "v1"
_PIPELINE_VERSION = "1.0"
_PROCESSING_VERSION = "1.0.0"


class AnalysisPipeline:
    """
    Orchestrates the two-stage AI analysis pipeline for a single submission.

    Inject gateway and repository via constructor for full testability.
    """

    def __init__(
        self,
        gateway: BaseAIGateway | None = None,
        repository: BaseAnalysisRepository | None = None,
    ) -> None:
        self._gateway = gateway or get_gateway()
        self._repository = repository

    async def run(
        self,
        submission_id: str,
        submission_data: dict,
        request_id: str,
    ) -> PipelineResult:
        """
        Execute the two-stage pipeline for a submission.

        Args:
            submission_id:   Firestore submission document ID.
            submission_data: Raw submission document as a dict.
            request_id:      BAD-01 request ID for observability correlation.

        Returns:
            PipelineResult with success flag, analysis, and full state history.
        """
        ctx = PipelineContext(
            request_id=request_id,
            submission_id=submission_id,
            submission_data=submission_data,
        )
        ctx.transition(PipelineState.RECEIVED)

        # Bootstrap a partial analysis document early so state updates can be persisted
        analysis_id: str | None = None
        if self._repository:
            try:
                analysis_id = await self._repository.create_analysis({
                    "submissionId": submission_id,
                    "pipelineState": PipelineState.RECEIVED,
                    "stateHistory": ctx.state_history,
                    "processedAt": datetime.datetime.now(datetime.UTC).isoformat(),
                })
                logger.info(
                    f"[AnalysisPipeline] Bootstrap analysis document created: {analysis_id}"
                )
            except AnalysisDatabaseException as exc:
                logger.error(f"[AnalysisPipeline] Failed to bootstrap analysis document: {exc}")
                return PipelineResult(
                    success=False,
                    pipeline_state=PipelineState.FAILED,
                    error_message=f"Failed to bootstrap analysis document: {exc}",
                    state_history=ctx.state_history,
                )

        try:
            # ── Stage 1: Normalize ────────────────────────────────────────────
            await self._persist_state(ctx, analysis_id, PipelineState.PROMPT_LOADING)
            s1_template = load_prompt_template("stage1_normalize", _PROMPT_VERSION)
            s1_prompt_version = get_prompt_version_from_manifest("stage1_normalize", _PROMPT_VERSION)

            s1_variables = self._build_stage1_variables(submission_data)
            s1_prompt = build_prompt(s1_template, s1_variables)

            await self._persist_state(ctx, analysis_id, PipelineState.AI_PROCESSING,
                                      "Stage 1: Normalize")
            s1_response = await self._gateway.generate(
                prompt=s1_prompt,
                prompt_name="stage1_normalize",
                prompt_version=s1_prompt_version,
                output_schema=STAGE1_SCHEMA,
            )
            log_ai_metrics(request_id, submission_id, "stage1_normalize", s1_response.metrics)
            ctx.stage1_metrics = build_metrics_dict(s1_response.metrics)
            ctx.total_latency_ms += s1_response.metrics.latency_ms

            await self._persist_state(ctx, analysis_id, PipelineState.PARSING,
                                      "Stage 1 response received")
            ctx.language = s1_response.parsed.get("language", "en")
            ctx.translated_text = s1_response.parsed.get("translatedText")
            ctx.summary = s1_response.parsed["summary"]

            # ── Stage 2: Reason ───────────────────────────────────────────────
            await self._persist_state(ctx, analysis_id, PipelineState.PROMPT_LOADING,
                                      "Stage 2: Reason")
            s2_template = load_prompt_template("stage2_reason", _PROMPT_VERSION)
            s2_prompt_version = get_prompt_version_from_manifest("stage2_reason", _PROMPT_VERSION)

            s2_variables = self._build_stage2_variables(ctx, submission_data)
            s2_prompt = build_prompt(s2_template, s2_variables)

            await self._persist_state(ctx, analysis_id, PipelineState.AI_PROCESSING,
                                      "Stage 2: Reason")
            s2_response = await self._gateway.generate(
                prompt=s2_prompt,
                prompt_name="stage2_reason",
                prompt_version=s2_prompt_version,
                output_schema=STAGE2_SCHEMA,
            )
            log_ai_metrics(request_id, submission_id, "stage2_reason", s2_response.metrics)
            ctx.stage2_metrics = build_metrics_dict(s2_response.metrics)
            ctx.total_latency_ms += s2_response.metrics.latency_ms

            await self._persist_state(ctx, analysis_id, PipelineState.PARSING,
                                      "Stage 2 response received")
            ctx.category = s2_response.parsed["category"]
            ctx.themes = s2_response.parsed.get("themes", [])
            ctx.confidence = float(s2_response.parsed["confidence"])
            ctx.recommendation = s2_response.parsed["recommendation"]
            ctx.reasoning = s2_response.parsed.get("reasoning", "")

            # ── Build and persist AnalysisResult ─────────────────────────────
            await self._persist_state(ctx, analysis_id, PipelineState.PERSISTING)
            review_required = ctx.confidence < _REVIEW_THRESHOLD

            analysis = AnalysisResult(
                submissionId=submission_id,
                analysisId=analysis_id,
                language=ctx.language,
                translatedText=ctx.translated_text,
                summary=ctx.summary,
                category=ctx.category,
                themes=ctx.themes,
                confidence=ctx.confidence,
                recommendation=ctx.recommendation,
                reasoning=ctx.reasoning,
                reviewRequired=review_required,
                pipelineState=PipelineState.COMPLETED,
                stateHistory=ctx.state_history,
                processingVersion=_PROCESSING_VERSION,
                pipelineVersion=_PIPELINE_VERSION,
                promptVersion=_PROMPT_VERSION,
                model=s1_response.metrics.model,
                totalLatencyMs=round(ctx.total_latency_ms, 2),
                stage1Metrics=ctx.stage1_metrics,
                stage2Metrics=ctx.stage2_metrics,
                processedAt=datetime.datetime.now(datetime.UTC).isoformat(),
            )

            final_id = analysis_id
            if self._repository:
                final_payload = analysis.model_dump()
                if analysis_id:
                    # Update the bootstrap document with full results
                    await self._repository.update_pipeline_state(
                        analysis_id, PipelineState.COMPLETED, ctx.state_history
                    )
                    # Merge full analysis data
                    try:
                        from app.db.firestore import get_firestore_client
                        client = get_firestore_client()
                        client.collection("analysis").document(analysis_id).set(
                            final_payload, merge=True
                        )
                    except Exception as exc:
                        logger.warning(
                            f"[AnalysisPipeline] Could not merge final payload: {exc}"
                        )
                else:
                    final_id = await self._repository.create_analysis(final_payload)

            ctx.transition(PipelineState.COMPLETED)
            logger.info(
                f"[AnalysisPipeline] COMPLETED for submission {submission_id} "
                f"| analysisId={final_id} | confidence={ctx.confidence:.2f} "
                f"| reviewRequired={review_required}"
            )

            return PipelineResult(
                success=True,
                analysis=analysis,
                analysis_id=final_id,
                pipeline_state=PipelineState.COMPLETED,
                state_history=ctx.state_history,
            )

        except (AIGatewayException, ParsingException, PipelineException) as exc:
            ctx.transition(PipelineState.FAILED, str(exc))
            logger.error(
                f"[AnalysisPipeline] FAILED for submission {submission_id}: {exc}"
            )
            if self._repository and analysis_id:
                try:
                    await self._repository.update_pipeline_state(
                        analysis_id, PipelineState.FAILED, ctx.state_history
                    )
                except Exception:
                    pass  # Best-effort — do not mask original error

            return PipelineResult(
                success=False,
                analysis_id=analysis_id,
                pipeline_state=PipelineState.FAILED,
                error_message=str(exc),
                state_history=ctx.state_history,
            )

    # ── Helpers ───────────────────────────────────────────────────────────────

    async def _persist_state(
        self,
        ctx: PipelineContext,
        analysis_id: str | None,
        state: PipelineState,
        detail: str | None = None,
    ) -> None:
        """Transition context state and persist the change to Firestore."""
        ctx.transition(state.value, detail)
        if self._repository and analysis_id:
            try:
                await self._repository.update_pipeline_state(
                    analysis_id, state.value, ctx.state_history
                )
            except Exception as exc:
                # Non-fatal — log and continue
                logger.warning(
                    f"[AnalysisPipeline] Could not persist state '{state}': {exc}"
                )

    @staticmethod
    def _build_stage1_variables(submission_data: dict) -> dict:
        """Extract Stage 1 template variables from the raw submission document."""
        information = submission_data.get("information", {})
        location = submission_data.get("location", {})

        # Support both field names: 'description' (frontend) and 'issueDescription' (legacy)
        submission_text = (
            information.get("description")
            or information.get("issueDescription")
            or information.get("title")
            or ""
        )
        location_str = (
            location.get("locality")
            or location.get("ward")
            or location.get("district")
            or "Unknown location"
        )
        category_hint = information.get("category", "General")

        return {
            "submission_text": submission_text or "No description provided.",
            "location": location_str,
            "category_hint": category_hint,
        }

    @staticmethod
    def _build_stage2_variables(ctx: PipelineContext, submission_data: dict) -> dict:
        """Build Stage 2 template variables using Stage 1 output from context."""
        information = submission_data.get("information", {})
        location = submission_data.get("location", {})
        location_str = (
            location.get("locality")
            or location.get("ward")
            or location.get("district")
            or "Unknown location"
        )
        return {
            "summary": ctx.summary or "No summary available.",
            "location": location_str,
            "language": ctx.language or "en",
            "category_hint": information.get("category", "General"),
        }
