from datetime import datetime
from app.schemas.submission_request import SubmissionRequest
from app.repositories.base_submission_repository import BaseSubmissionRepository
from app.core.logging import logger

class SubmissionService:
    def __init__(self, repo: BaseSubmissionRepository):
        self.repo = repo

    async def create_submission(self, request: SubmissionRequest, request_id: str) -> dict:
        """
        Processes and persists a citizen submission draft into the database repository.
        Renames 'version' to 'schemaVersion' and tracks client/server timestamps.
        Sets initial status to 'RECEIVED'.
        """
        logger.info(
            f"[{request_id}] [SubmissionService] Persisting submission: "
            f"Title='{request.information.title}', Category='{request.information.category}'"
        )
        
        # 1. Build document payload structure
        payload = {
            "schemaVersion": request.version,
            "requestId": request_id,
            "createdAt": request.createdAt,
            "serverCreatedAt": datetime.utcnow().isoformat() + "Z",
            "status": "RECEIVED",
            "information": request.information.model_dump(),
            "voice": request.voice.model_dump() if request.voice else None,
            "images": [img.model_dump() for img in request.images] if request.images else [],
            "location": request.location.model_dump() if request.location else None,
        }

        # 2. Persist using the abstract repository layer
        submission_id = await self.repo.create_submission(payload)
        
        logger.info(
            f"[{request_id}] [SubmissionService] Submission successfully persisted with "
            f"Document ID: {submission_id}"
        )
        
        return {
            "success": True,
            "requestId": request_id,
            "status": "received",
            "data": {
                "submissionId": submission_id
            }
        }
