"""
routes/analysis.py

Analysis API routes.

Endpoint:
    POST /api/v1/analysis/submissions/{submissionId}
        Triggers the two-stage AI analysis pipeline for the given submission.

All endpoints follow the BAD-01 standard response envelope.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.ai.pipeline.analysis_pipeline import AnalysisPipeline
from app.api.dependencies.analysis import get_analysis_pipeline
from app.repositories.base_submission_repository import NotFoundException, DatabaseException
from app.repositories.submission_repository import FirestoreSubmissionRepository
from app.core.logging import logger
from app.utils.request_id import generate_request_id

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post(
    "/submissions/{submission_id}",
    status_code=status.HTTP_200_OK,
    summary="Trigger AI analysis pipeline for a submission",
    description=(
        "Runs the two-stage Gemini analysis pipeline for the given submission. "
        "Returns the analysis result including category, themes, confidence score, "
        "and MP recommendation. If confidence < 0.85, the result is flagged for "
        "human review."
    ),
)
async def analyze_submission(
    submission_id: str,
    request: Request,
    pipeline: AnalysisPipeline = Depends(get_analysis_pipeline),
):
    """
    POST /api/v1/analysis/submissions/{submissionId}

    Loads the submission from Firestore and triggers the analysis pipeline.
    """
    request_id = getattr(request.state, "request_id", None) or generate_request_id()

    logger.info(
        f"[{request_id}] [AnalysisRoute] Analysis requested for submission: {submission_id}"
    )

    # ── Load submission from Firestore ────────────────────────────────────────
    try:
        repo = FirestoreSubmissionRepository()
        submission_data = await repo.get_submission(submission_id)
    except DatabaseException as exc:
        logger.error(
            f"[{request_id}] [AnalysisRoute] Database error loading submission: {exc}"
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "DATABASE_ERROR",
                    "message": "Unable to load submission from database.",
                },
            },
        )

    if submission_data is None:
        logger.warning(
            f"[{request_id}] [AnalysisRoute] Submission not found: {submission_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "SUBMISSION_NOT_FOUND",
                    "message": f"Submission '{submission_id}' does not exist.",
                },
            },
        )

    # ── Run pipeline ──────────────────────────────────────────────────────────
    result = await pipeline.run(
        submission_id=submission_id,
        submission_data=submission_data,
        request_id=request_id,
    )

    if not result.success:
        logger.error(
            f"[{request_id}] [AnalysisRoute] Pipeline FAILED: {result.error_message}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "PIPELINE_FAILED",
                    "message": result.error_message or "Analysis pipeline failed.",
                    "pipelineState": result.pipeline_state,
                },
            },
        )

    logger.info(
        f"[{request_id}] [AnalysisRoute] Analysis COMPLETED | "
        f"analysisId={result.analysis_id} | "
        f"confidence={result.analysis.confidence:.2f} | "
        f"reviewRequired={result.analysis.reviewRequired}"
    )

    return {
        "success": True,
        "requestId": request_id,
        "data": {
            "analysisId": result.analysis_id,
            "submissionId": submission_id,
            "pipelineState": result.pipeline_state,
            "analysis": result.analysis.model_dump(),
        },
    }
