"""
intelligence_repository.py

Concrete Firestore implementation of BaseIntelligenceRepository.
Writes to the top-level `intelligence` collection.
"""
from google.cloud.exceptions import GoogleCloudError

from app.ai.intelligence.repositories.base_intelligence_repository import (
    BaseIntelligenceRepository,
    IntelligenceDatabaseException,
    IntelligenceNotFoundException,
)
from app.db.firestore import get_firestore_client
from app.core.logging import logger

_COLLECTION = "intelligence"


class FirestoreIntelligenceRepository(BaseIntelligenceRepository):
    """Persists intelligence results to the Firestore `intelligence/` collection."""

    async def create_intelligence(self, payload: dict) -> str:
        """Create a new intelligence document and return its ID."""
        try:
            client = get_firestore_client()
            doc_ref = client.collection(_COLLECTION).document()
            # Mutate payload to ensure intelligenceId is stored inside the doc
            payload["intelligenceId"] = doc_ref.id
            doc_ref.set(payload)
            logger.info(
                f"[FirestoreIntelligenceRepository] Created intelligence document: {doc_ref.id}"
            )
            return doc_ref.id
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreIntelligenceRepository] Google Cloud error during create: {gce}"
            )
            raise IntelligenceDatabaseException(
                f"Database error creating intelligence: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreIntelligenceRepository] Unexpected error during create: {exc}"
            )
            raise IntelligenceDatabaseException(
                f"Unexpected error creating intelligence: {exc}"
            ) from exc

    async def get_intelligence(self, intelligence_id: str) -> dict | None:
        """Retrieve an intelligence document by its ID."""
        try:
            client = get_firestore_client()
            doc = client.collection(_COLLECTION).document(intelligence_id).get()
            return doc.to_dict() if doc.exists else None
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreIntelligenceRepository] Google Cloud error during get: {gce}"
            )
            raise IntelligenceDatabaseException(
                f"Database error retrieving intelligence: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreIntelligenceRepository] Unexpected error during get: {exc}"
            )
            raise IntelligenceDatabaseException(
                f"Unexpected error retrieving intelligence: {exc}"
            ) from exc

    async def get_intelligence_by_submission(self, submission_id: str) -> dict | None:
        """Retrieve the intelligence document for a given submission ID."""
        try:
            client = get_firestore_client()
            docs = (
                client.collection(_COLLECTION)
                .where("submissionId", "==", submission_id)
                .limit(1)
                .stream()
            )
            for doc in docs:
                return doc.to_dict()
            return None
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreIntelligenceRepository] Google Cloud error during query: {gce}"
            )
            raise IntelligenceDatabaseException(
                f"Database error querying intelligence by submission: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreIntelligenceRepository] Unexpected error during query: {exc}"
            )
            raise IntelligenceDatabaseException(
                f"Unexpected error querying intelligence by submission: {exc}"
            ) from exc

    async def update_ie_state(
        self, intelligence_id: str, state: str, state_history: list
    ) -> bool:
        """Update ieState and stateHistory on an existing intelligence document."""
        try:
            client = get_firestore_client()
            doc_ref = client.collection(_COLLECTION).document(intelligence_id)
            doc = doc_ref.get()
            if not doc.exists:
                raise IntelligenceNotFoundException(
                    f"Intelligence document '{intelligence_id}' not found."
                )
            doc_ref.update({"ieState": state, "stateHistory": state_history})
            return True
        except IntelligenceNotFoundException:
            raise
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreIntelligenceRepository] Google Cloud error during state update: {gce}"
            )
            raise IntelligenceDatabaseException(
                f"Database error updating ieState: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreIntelligenceRepository] Unexpected error during state update: {exc}"
            )
            raise IntelligenceDatabaseException(
                f"Unexpected error updating ieState: {exc}"
            ) from exc
