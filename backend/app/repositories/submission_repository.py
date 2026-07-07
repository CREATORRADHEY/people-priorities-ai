from google.cloud.exceptions import GoogleCloudError
from app.repositories.base_submission_repository import BaseSubmissionRepository, DatabaseException, NotFoundException
from app.db.firestore import get_firestore_client
from app.core.logging import logger

class FirestoreSubmissionRepository(BaseSubmissionRepository):
    def __init__(self):
        self.collection_name = "submissions"

    async def create_submission(self, payload: dict) -> str:
        try:
            client = get_firestore_client()
            doc_ref = client.collection(self.collection_name).document()
            doc_ref.set(payload)
            return doc_ref.id
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreSubmissionRepository] Google Cloud error during creation: {gce}")
            raise DatabaseException(f"Database error during creation: {gce}") from gce
        except Exception as e:
            logger.error(f"[FirestoreSubmissionRepository] Unexpected error during creation: {e}")
            raise DatabaseException(f"Unexpected database error: {e}") from e

    async def get_submission(self, submission_id: str) -> dict | None:
        try:
            client = get_firestore_client()
            doc_ref = client.collection(self.collection_name).document(submission_id)
            doc = doc_ref.get()
            if not doc.exists:
                return None
            return doc.to_dict()
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreSubmissionRepository] Google Cloud error during retrieval: {gce}")
            raise DatabaseException(f"Database error during retrieval: {gce}") from gce
        except Exception as e:
            logger.error(f"[FirestoreSubmissionRepository] Unexpected error during retrieval: {e}")
            raise DatabaseException(f"Unexpected database error: {e}") from e

    async def update_status(self, submission_id: str, status: str) -> bool:
        try:
            client = get_firestore_client()
            doc_ref = client.collection(self.collection_name).document(submission_id)
            
            # Verify document exists before updating
            doc = doc_ref.get()
            if not doc.exists:
                raise NotFoundException(f"Submission with ID {submission_id} not found.")
                
            doc_ref.update({"status": status})
            return True
        except NotFoundException as nfe:
            raise nfe
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreSubmissionRepository] Google Cloud error during status update: {gce}")
            raise DatabaseException(f"Database error during status update: {gce}") from gce
        except Exception as e:
            logger.error(f"[FirestoreSubmissionRepository] Unexpected error during status update: {e}")
            raise DatabaseException(f"Unexpected database error: {e}") from e

    async def exists(self, submission_id: str) -> bool:
        try:
            client = get_firestore_client()
            doc_ref = client.collection(self.collection_name).document(submission_id)
            doc = doc_ref.get()
            return doc.exists
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreSubmissionRepository] Google Cloud error during existence check: {gce}")
            raise DatabaseException(f"Database error during existence check: {gce}") from gce
        except Exception as e:
            logger.error(f"[FirestoreSubmissionRepository] Unexpected error during existence check: {e}")
            raise DatabaseException(f"Unexpected database error: {e}") from e
