import time
from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile, BackgroundTasks
from app.schemas.submission_request import SubmissionRequest
from app.schemas.submission_response import SubmissionSuccessResponse
from app.schemas.upload_response import UploadSuccessResponse
from app.services.submission_service import SubmissionService
from app.services.media_upload_service import MediaUploadService
from app.repositories.base_submission_repository import BaseSubmissionRepository
from app.repositories.storage_repository import BaseStorageRepository
from app.api.dependencies.repositories import get_submission_repository, get_storage_repository
from app.api.dependencies.storage import get_storage_service
from app.storage.base_storage_service import BaseStorageService
from app.utils.request_id import generate_request_id
from app.core.logging import logger
from app.ai.pipeline.analysis_pipeline import AnalysisPipeline
from app.ai.repositories.analysis_repository import FirestoreAnalysisRepository

router = APIRouter()


async def _run_analysis_background(submission_id: str, submission_data: dict, request_id: str):
    """
    Background task: runs the FULL 3-stage AI pipeline on a newly submitted grievance.

    Stage 1+2: AnalysisPipeline (Gemini AI → category, themes, confidence, summary)
    Stage 3:   IntelligencePipeline (priority scoring, hotspot detection, recommendations)

    Called automatically after every successful submission so the MP dashboard
    Priority Queue and hotspot detection populate without any manual trigger.
    """
    import asyncio

    # ── Stage 1+2: Gemini AI Analysis ─────────────────────────────────────────
    try:
        logger.info(f"[{request_id}] [BGPipeline] Starting Gemini analysis for: {submission_id}")
        analysis_repo = FirestoreAnalysisRepository()
        analysis_pipeline = AnalysisPipeline(repository=analysis_repo)
        analysis_result = await analysis_pipeline.run(
            submission_id=submission_id,
            submission_data=submission_data,
            request_id=request_id,
        )
        if not analysis_result.success:
            logger.error(f"[{request_id}] [BGPipeline] Analysis FAILED: {analysis_result.error_message}")
            return
        logger.info(
            f"[{request_id}] [BGPipeline] Analysis COMPLETED | "
            f"analysisId={analysis_result.analysis_id} | confidence={analysis_result.analysis.confidence:.2f}"
        )
    except Exception as e:
        logger.error(f"[{request_id}] [BGPipeline] Analysis stage exception: {e}", exc_info=True)
        return

    # Brief pause to ensure Firestore write is fully committed before reading back
    await asyncio.sleep(1)

    # ── Stage 3: Intelligence Engine ───────────────────────────────────────────
    try:
        logger.info(f"[{request_id}] [BGPipeline] Starting Intelligence pipeline for: {submission_id}")
        from app.ai.repositories.analysis_repository import FirestoreAnalysisRepository as AnalysisRepo
        from app.ai.intelligence.pipeline.intelligence_pipeline import IntelligencePipeline
        from app.ai.intelligence.repositories.intelligence_repository import FirestoreIntelligenceRepository

        # Fetch the completed analysis document from Firestore
        analysis_fetch_repo = AnalysisRepo()
        analysis_data = await analysis_fetch_repo.get_analysis_by_submission(submission_id)

        if not analysis_data:
            # Fallback: build analysis_data from the pipeline result directly
            logger.warning(f"[{request_id}] [BGPipeline] Could not fetch analysis from Firestore, using in-memory result")
            analysis_data = analysis_result.analysis.model_dump()
            analysis_data["analysisId"] = analysis_result.analysis_id

        intel_repo = FirestoreIntelligenceRepository()
        intel_pipeline = IntelligencePipeline(repository=intel_repo)
        intel_result = await intel_pipeline.run(
            submission_id=submission_id,
            analysis_data=analysis_data,
            submission_data=submission_data,
            request_id=request_id,
        )

        if intel_result.get("success"):
            intel = intel_result["intelligence"]
            logger.info(
                f"[{request_id}] [BGPipeline] Intelligence COMPLETED | "
                f"intelligenceId={intel_result['intelligence_id']} | "
                f"priority={intel.priorityLevel} | score={intel.priorityScore}"
            )
        else:
            logger.error(f"[{request_id}] [BGPipeline] Intelligence FAILED: {intel_result.get('error')}")

    except Exception as e:
        logger.error(f"[{request_id}] [BGPipeline] Intelligence stage exception: {e}", exc_info=True)



@router.post(
    "/submissions",
    response_model=SubmissionSuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit a development issue report",
    description="Accepts issue details, voice recording metadata, image metadata, and location details."
)
async def create_submission(
    request: SubmissionRequest,
    raw_request: Request,
    background_tasks: BackgroundTasks,
    repo: BaseSubmissionRepository = Depends(get_submission_repository)
):
    request_id = getattr(raw_request.state, "request_id", generate_request_id())
    start_time = time.time()
    
    # Structured Request Logging
    logger.info(
        f"[{request_id}] [API Request] POST /api/v1/submissions - "
        f"Category: '{request.information.category}', Lang: '{request.information.language}', "
        f"Images: {len(request.images)}, GPS: {'yes' if request.location else 'no'}"
    )
    
    try:
        # Inject repository into service layer
        service = SubmissionService(repo)
        result = await service.create_submission(request, request_id)
        
        duration = time.time() - start_time
        # Structured Response Logging
        logger.info(
            f"[{request_id}] [API Response] Status: 200 OK, Duration: {duration:.4f}s"
        )

        # Auto-trigger AI analysis pipeline in the background
        # so the MP dashboard updates without any manual call
        submission_id = result["data"]["submissionId"]
        submission_data = {
            "information": request.information.model_dump(),
            "voice": request.voice.model_dump() if request.voice else None,
            "images": [img.model_dump() for img in request.images] if request.images else [],
            "location": request.location.model_dump() if request.location else None,
        }
        background_tasks.add_task(
            _run_analysis_background, submission_id, submission_data, request_id
        )
        logger.info(f"[{request_id}] [API] AI analysis queued as background task for: {submission_id}")

        return result
        
    except HTTPException as he:
        duration = time.time() - start_time
        logger.warning(
            f"[{request_id}] [API Warning] Status: {he.status_code}, "
            f"Duration: {duration:.4f}s, Detail: {he.detail}"
        )
        raise he
    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            f"[{request_id}] [API Error] Status: 500 Internal Error, "
            f"Duration: {duration:.4f}s, Details: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during submission processing: {str(e)}"
        )



@router.post(
    "/submissions/{submission_id}/media",
    response_model=UploadSuccessResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload citizen multimedia evidence",
    description="Accepts optional voice and multiple image file binaries, saves to storage, and links metadata."
)
async def upload_submission_media(
    submission_id: str,
    raw_request: Request,
    voice: UploadFile = File(None),
    images: list[UploadFile] = File([]),
    storage_service: BaseStorageService = Depends(get_storage_service),
    storage_repo: BaseStorageRepository = Depends(get_storage_repository),
    submission_repo: BaseSubmissionRepository = Depends(get_submission_repository)
):
    request_id = getattr(raw_request.state, "request_id", generate_request_id())
    start_time = time.time()
    
    logger.info(
        f"[{request_id}] [API Request] POST /api/v1/submissions/{submission_id}/media - "
        f"Voice: {'yes' if voice else 'no'}, Images Count: {len(images)}"
    )
    
    try:
        service = MediaUploadService(storage_service, storage_repo, submission_repo)
        result = await service.upload_media(submission_id, voice, images, request_id)
        
        duration = time.time() - start_time
        logger.info(
            f"[{request_id}] [API Response] POST /api/v1/submissions/{submission_id}/media - "
            f"Status: 200 OK, Duration: {duration:.4f}s"
        )
        return result
    except HTTPException as he:
        duration = time.time() - start_time
        logger.warning(
            f"[{request_id}] [API Warning] Status: {he.status_code}, "
            f"Duration: {duration:.4f}s, Detail: {he.detail}"
        )
        raise he
    except Exception as e:
        duration = time.time() - start_time
        logger.error(
            f"[{request_id}] [API Error] Status: 500 Internal Error, "
            f"Duration: {duration:.4f}s, Details: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during media uploads: {str(e)}"
        )

