from abc import ABC, abstractmethod
from google.cloud.exceptions import GoogleCloudError
from app.repositories.base_submission_repository import DatabaseException, NotFoundException
from app.db.firestore import get_firestore_client
from app.core.logging import logger

class BaseStorageRepository(ABC):
    @abstractmethod
    async def save_media_references(self, submission_id: str, voice: dict | None, images: list[dict]) -> bool:
        """
        Saves uploaded voice and images media metadata references to the Firestore submission document.
        Raises DatabaseException or NotFoundException on error.
        """
        pass

class FirestoreStorageRepository(BaseStorageRepository):
    def __init__(self):
        self.collection_name = "submissions"

    async def save_media_references(self, submission_id: str, voice: dict | None, images: list[dict]) -> bool:
        try:
            client = get_firestore_client()
            doc_ref = client.collection(self.collection_name).document(submission_id)
            
            # Verify submission exists before updating
            doc = doc_ref.get()
            if not doc.exists:
                raise NotFoundException(f"Submission with ID {submission_id} not found.")

            update_data = {}
            if voice is not None:
                update_data["voice"] = voice
            if images:
                update_data["images"] = images

            if update_data:
                doc_ref.update(update_data)
                
            return True
        except NotFoundException as nfe:
            raise nfe
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreStorageRepository] Google Cloud error during media update: {gce}")
            raise DatabaseException(f"Database error during media update: {gce}") from gce
        except Exception as e:
            logger.error(f"[FirestoreStorageRepository] Unexpected error during media update: {e}")
            raise DatabaseException(f"Unexpected database error during media update: {e}") from e
