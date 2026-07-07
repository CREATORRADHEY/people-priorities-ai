import time
from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile
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

router = APIRouter()

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
            detail="Internal server error during submission processing."
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

