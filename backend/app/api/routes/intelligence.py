"""
routes/intelligence.py

Intelligence API routes.

Endpoint:
    POST /api/v1/intelligence/submissions/{submissionId}
        Triggers the intelligence pipeline for the given submission.
        Requires that the submission has already run through the AI analysis pipeline.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.ai.intelligence.pipeline.intelligence_pipeline import IntelligencePipeline
from app.api.dependencies.intelligence import get_intelligence_pipeline
from app.ai.repositories.analysis_repository import FirestoreAnalysisRepository
from app.repositories.submission_repository import FirestoreSubmissionRepository
from app.repositories.base_submission_repository import DatabaseException
from app.core.logging import logger
from app.utils.request_id import generate_request_id

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


@router.post(
    "/submissions/{submission_id}",
    status_code=status.HTTP_200_OK,
    summary="Trigger Intelligence pipeline for a submission",
    description=(
        "Executes the intelligence pipeline (IE-1 through IE-6) on the specified submission. "
        "The submission must have already undergone AI analysis (FP-3.1). "
        "Produces a scored, classified, and actionable intelligence result."
    ),
)
async def analyze_intelligence(
    submission_id: str,
    request: Request,
    pipeline: IntelligencePipeline = Depends(get_intelligence_pipeline),
):
    """
    POST /api/v1/intelligence/submissions/{submissionId}
    """
    request_id = getattr(request.state, "request_id", None) or generate_request_id()
    logger.info(
        f"[{request_id}] [IntelligenceRoute] Intelligence analysis requested for submission: {submission_id}"
    )

    # 1. Load submission data
    try:
        sub_repo = FirestoreSubmissionRepository()
        submission_data = await sub_repo.get_submission(submission_id)
    except DatabaseException as exc:
        logger.error(f"[{request_id}] [IntelligenceRoute] Database error loading submission: {exc}")
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

    if not submission_data:
        logger.warning(f"[{request_id}] [IntelligenceRoute] Submission not found: {submission_id}")
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

    # 2. Load analysis data (must run after AI analysis)
    try:
        analysis_repo = FirestoreAnalysisRepository()
        analysis_data = await analysis_repo.get_analysis_by_submission(submission_id)
    except Exception as exc:
        logger.error(f"[{request_id}] [IntelligenceRoute] Database error loading analysis: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "DATABASE_ERROR",
                    "message": "Unable to load analysis from database.",
                },
            },
        )

    if not analysis_data:
        logger.warning(
            f"[{request_id}] [IntelligenceRoute] Analysis not found for submission: {submission_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "ANALYSIS_REQUIRED",
                    "message": f"Submission '{submission_id}' has not been analyzed yet. Run analysis first.",
                },
            },
        )

    # 3. Run Pipeline
    res = await pipeline.run(
        submission_id=submission_id,
        analysis_data=analysis_data,
        submission_data=submission_data,
        request_id=request_id,
    )

    if not res.get("success"):
        logger.error(f"[{request_id}] [IntelligenceRoute] Pipeline execution failed: {res.get('error')}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "requestId": request_id,
                "error": {
                    "code": "INTELLIGENCE_FAILED",
                    "message": res.get("error") or "Intelligence pipeline execution failed.",
                    "ieState": res.get("ie_state", "FAILED"),
                },
            },
        )

    logger.info(
        f"[{request_id}] [IntelligenceRoute] Pipeline completed. "
        f"intelId={res['intelligence_id']} | priority={res['intelligence'].priorityScore}"
    )

    return {
        "success": True,
        "requestId": request_id,
        "data": {
            "intelligenceId": res["intelligence_id"],
            "submissionId": submission_id,
            "analysisId": analysis_data["analysisId"],
            "ieState": res["ie_state"],
            "priorityScore": res["intelligence"].priorityScore,
            "priorityLevel": res["intelligence"].priorityLevel,
            "isDuplicate": res["intelligence"].isDuplicate,
            "isHotspot": res["intelligence"].isHotspot,
        },
    }
