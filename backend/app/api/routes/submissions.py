import time
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.schemas.submission_request import SubmissionRequest
from app.schemas.submission_response import SubmissionSuccessResponse
from app.services.submission_service import SubmissionService
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
    service: SubmissionService = Depends(SubmissionService)
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
        result = service.create_submission(request, request_id)
        
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
