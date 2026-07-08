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
    Background task: runs the Gemini AI analysis pipeline on a newly submitted grievance.
    Called automatically after every successful submission so the MP dashboard
    Priority Queue and hotspot detection populate without any manual trigger.
    """
    try:
        logger.info(f"[{request_id}] [BGAnalysis] Starting AI pipeline for submission: {submission_id}")
        repo = FirestoreAnalysisRepository()
        pipeline = AnalysisPipeline(repository=repo)
        result = await pipeline.run(
            submission_id=submission_id,
            submission_data=submission_data,
            request_id=request_id,
        )
        if result.success:
            logger.info(
                f"[{request_id}] [BGAnalysis] AI pipeline COMPLETED | "
                f"analysisId={result.analysis_id} | confidence={result.analysis.confidence:.2f}"
            )
        else:
            logger.error(f"[{request_id}] [BGAnalysis] AI pipeline FAILED: {result.error_message}")
    except Exception as e:
        logger.error(f"[{request_id}] [BGAnalysis] Unexpected error in background analysis: {e}")


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

