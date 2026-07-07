from app.schemas.submission_request import SubmissionRequest
from app.core.logging import logger

class SubmissionService:
    def create_submission(self, request: SubmissionRequest, request_id: str) -> dict:
        """
        Processes a citizen submission.
        Validates business rules and prepares data.
        In SPRINT 2 - FP-2.1, it validates input and returns a success status
        without invoking database or storage services.
        """
        logger.info(
            f"[{request_id}] [SubmissionService] Processing submission: "
            f"Title='{request.information.title}', Category='{request.information.category}'"
        )
        
        # Business logic rules layer can be expanded here.
        # e.g., spam detection, content moderation limits (without external APIs)
        
        return {
            "success": True,
            "requestId": request_id,
            "status": "accepted",
            "message": "Submission accepted.",
            "data": {
                "submissionId": None
            }
        }
