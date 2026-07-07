"""
intelligence_pipeline.py

Orchestrates the six-stage Intelligence Engine (IE) pipeline.
Runs deterministically, performing:
  1. Classification (IE-1)
  2. Theme Normalization (IE-2)
  3. Duplicate Detection (IE-3)
  4. Hotspot Detection (IE-4)
  5. Priority Scoring (IE-5)
  6. Recommendation Generation (IE-6)

Saves the outcome to the intelligence/ collection.
All state transitions are persisted.
"""
import datetime
from typing import Any

from app.ai.intelligence.models.intelligence import IntelligenceContext, IntelligenceResult
from app.ai.intelligence.classification.classifier import classify
from app.ai.intelligence.themes.extractor import normalize_themes
from app.ai.intelligence.duplicates.duplicate_detector import detect_duplicate
from app.ai.intelligence.hotspots.hotspot_detector import detect_hotspot
from app.ai.intelligence.scoring.priority_engine import compute_priority
from app.ai.intelligence.recommendations.recommendation_engine import generate_recommendation
from app.ai.intelligence.repositories.base_intelligence_repository import (
    BaseIntelligenceRepository,
    IntelligenceDatabaseException,
)
from app.core.config import settings
from app.core.logging import logger
from app.db.firestore import get_firestore_client


class IntelligencePipeline:
    """
    Orchestrates the intelligence analysis pipeline for a submission.
    """

    def __init__(
        self,
        repository: BaseIntelligenceRepository | None = None,
    ) -> None:
        self._repository = repository

    async def run(
        self,
        submission_id: str,
        analysis_data: dict,
        submission_data: dict,
        request_id: str,
    ) -> dict:
        """
        Execute the intelligence pipeline on an analyzed submission.

        Args:
            submission_id:   Firestore ID of the submission.
            analysis_data:   The analysis/ result document dict.
            submission_data: The raw submission document dict.
            request_id:      Observability request ID.

        Returns:
            dict containing pipeline result details.
        """
        # Create pipeline context
        ctx = IntelligenceContext(
            request_id=request_id,
            submission_id=submission_id,
            analysis_id=analysis_data.get("analysisId") or "",
            ai_category=analysis_data.get("category", "Other"),
            ai_themes=analysis_data.get("themes", []),
            ai_confidence=float(analysis_data.get("confidence", 0.5)),
            ai_summary=analysis_data.get("summary", ""),
            location=submission_data.get("location", {}),
        )
        ctx.transition("ANALYZED")

        # 1. Bootstrap early intelligence document
        intel_id: str | None = None
        if self._repository:
            try:
                intel_id = await self._repository.create_intelligence({
                    "submissionId": submission_id,
                    "analysisId": ctx.analysis_id,
                    "ieState": "ANALYZED",
                    "stateHistory": ctx.state_history,
                    "generatedAt": datetime.datetime.now(datetime.UTC).isoformat(),
                    # Placeholder values populated later
                    "primaryCategory": "",
                    "secondaryCategory": None,
                    "categoryConfidence": 0.0,
                    "normalizedThemes": [],
                    "isDuplicate": False,
                    "duplicateOf": None,
                    "similarityScore": None,
                    "isHotspot": False,
                    "issueCount": 0,
                    "priorityScore": 0,
                    "priorityLevel": "LOW",
                    "recommendedAction": "",
                    "recommendedDepartment": "",
                    "urgency": "",
                    "recommendationReason": "",
                })
            except IntelligenceDatabaseException as exc:
                logger.error(f"[IntelligencePipeline] Bootstrap failed: {exc}")
                return {
                    "success": False,
                    "error": f"Failed to bootstrap intelligence document: {exc}",
                }

        try:
            # ── IE-1: Classification ──────────────────────────────────────────
            await self._persist_state(ctx, intel_id, "CLASSIFYING")
            cls_out = classify(ctx.ai_category, ctx.ai_themes, ctx.ai_confidence)
            ctx.primary_category = cls_out["primary_category"]
            ctx.secondary_category = cls_out["secondary_category"]
            ctx.category_confidence = cls_out["category_confidence"]

            # ── IE-2: Theme Normalization ─────────────────────────────────────
            await self._persist_state(ctx, intel_id, "THEMES_NORMALIZING")
            ctx.normalized_themes = normalize_themes(ctx.ai_themes)

            # Fetch candidates for duplicates & hotspots (past 90 days)
            candidates = await self._fetch_recent_analysis_candidates()

            # ── IE-3: Duplicate Detection ─────────────────────────────────────
            await self._persist_state(ctx, intel_id, "DUPLICATE_CHECKING")
            dup_out = detect_duplicate(
                category=ctx.primary_category,
                locality=ctx.locality(),
                summary=ctx.ai_summary,
                candidates=candidates,
            )
            ctx.is_duplicate = dup_out["is_duplicate"]
            ctx.duplicate_of = dup_out["duplicate_of"]
            ctx.similarity_score = dup_out["similarity_score"]

            # ── IE-4: Hotspot Detection ───────────────────────────────────────
            await self._persist_state(ctx, intel_id, "HOTSPOT_DETECTING")
            hot_out = detect_hotspot(
                category=ctx.primary_category,
                locality=ctx.locality(),
                candidates=candidates,
            )
            ctx.is_hotspot = hot_out["is_hotspot"]
            ctx.issue_count = hot_out["issue_count"]

            # ── IE-5: Priority Engine ─────────────────────────────────────────
            await self._persist_state(ctx, intel_id, "SCORING")
            score_out = compute_priority(
                category=ctx.primary_category,
                issue_count=ctx.issue_count,
                is_hotspot=ctx.is_hotspot,
                locality=ctx.locality(),
                ai_confidence=ctx.category_confidence,
            )
            ctx.priority_score = score_out["priority_score"]
            ctx.priority_level = score_out["priority_level"]

            # ── IE-6: Recommendation Engine ───────────────────────────────────
            await self._persist_state(ctx, intel_id, "RECOMMENDING")
            rec_out = generate_recommendation(
                category=ctx.primary_category,
                priority_level=ctx.priority_level,
                is_hotspot=ctx.is_hotspot,
                is_duplicate=ctx.is_duplicate,
                locality=ctx.locality(),
            )
            ctx.recommended_action = rec_out["action"]
            ctx.recommended_department = rec_out["department"]
            ctx.urgency = rec_out["urgency"]
            ctx.recommendation_reason = rec_out["reason"]

            # ── Final Persistence ─────────────────────────────────────────────
            await self._persist_state(ctx, intel_id, "COMPLETED")

            result = IntelligenceResult(
                submissionId=submission_id,
                analysisId=ctx.analysis_id,
                intelligenceId=intel_id,
                primaryCategory=ctx.primary_category,
                secondaryCategory=ctx.secondary_category,
                categoryConfidence=ctx.category_confidence,
                normalizedThemes=ctx.normalized_themes,
                isDuplicate=ctx.is_duplicate,
                duplicateOf=ctx.duplicate_of,
                similarityScore=ctx.similarity_score,
                isHotspot=ctx.is_hotspot,
                issueCount=ctx.issue_count,
                priorityScore=ctx.priority_score,
                priorityLevel=ctx.priority_level,
                recommendedAction=ctx.recommended_action,
                recommendedDepartment=ctx.recommended_department,
                urgency=ctx.urgency,
                recommendationReason=ctx.recommendation_reason,
                ieState="COMPLETED",
                stateHistory=ctx.state_history,
                generatedAt=datetime.datetime.now(datetime.UTC).isoformat(),
            )

            if self._repository and intel_id:
                client = get_firestore_client()
                client.collection("intelligence").document(intel_id).set(
                    result.model_dump(), merge=True
                )

            return {
                "success": True,
                "intelligence": result,
                "intelligence_id": intel_id,
                "ie_state": "COMPLETED",
            }

        except Exception as exc:
            logger.error(f"[IntelligencePipeline] Pipeline error: {exc}", exc_info=True)
            ctx.transition("FAILED", str(exc))
            if self._repository and intel_id:
                try:
                    await self._repository.update_ie_state(
                        intel_id, "FAILED", ctx.state_history
                    )
                except Exception:
                    pass
            return {
                "success": False,
                "error": str(exc),
                "ie_state": "FAILED",
            }

    async def _persist_state(
        self,
        ctx: IntelligenceContext,
        intel_id: str | None,
        state: str,
        detail: str | None = None,
    ) -> None:
        """Helper to transition state and update database."""
        ctx.transition(state, detail)
        if self._repository and intel_id:
            try:
                await self._repository.update_ie_state(
                    intel_id, state, ctx.state_history
                )
            except Exception as exc:
                logger.warning(f"[IntelligencePipeline] Could not update ieState to {state}: {exc}")

    async def _fetch_recent_analysis_candidates(self) -> list[dict]:
        """
        Fetch analysis documents processed within the last HOTSPOT_LOOKBACK_DAYS.
        """
        try:
            client = get_firestore_client()
            lookback_days = settings.HOTSPOT_LOOKBACK_DAYS
            cutoff = datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=lookback_days)
            cutoff_iso = cutoff.isoformat()

            # Perform query on analysis collection
            docs = (
                client.collection("analysis")
                .where("processedAt", ">=", cutoff_iso)
                .stream()
            )

            candidates = []
            for doc in docs:
                data = doc.to_dict()
                # Include document ID
                data["analysisId"] = doc.id
                candidates.append(data)

            # We also need to fetch corresponding submissions for location extraction
            # so duplicates and hotspot detectors can inspect locality.
            # To avoid N queries, let's load all recent submissions and match them.
            sub_docs = (
                client.collection("submissions")
                .where("serverCreatedAt", ">=", cutoff_iso)
                .stream()
            )
            sub_map = {}
            for sdoc in sub_docs:
                sub_map[sdoc.id] = sdoc.to_dict()

            # Merge location dicts into candidates
            for cand in candidates:
                sid = cand.get("submissionId")
                if sid in sub_map:
                    cand["location"] = sub_map[sid].get("location", {})
                    # Also set a top-level locality for backwards compatibility
                    loc_dict = sub_map[sid].get("location", {})
                    cand["locality"] = (
                        loc_dict.get("locality")
                        or loc_dict.get("ward")
                        or loc_dict.get("district")
                        or ""
                    )

            return candidates

        except Exception as exc:
            logger.error(f"[IntelligencePipeline] Failed to fetch candidates: {exc}")
            return []
