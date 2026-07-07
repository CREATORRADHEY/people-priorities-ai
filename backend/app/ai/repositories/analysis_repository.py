"""
analysis_repository.py

Concrete Firestore implementation of BaseAnalysisRepository.

Writes to the `analysis/` top-level collection.
Maps all Google Cloud exceptions to AnalysisDatabaseException so
the pipeline never sees raw cloud errors.
"""
from google.cloud.exceptions import GoogleCloudError

from app.ai.repositories.base_analysis_repository import (
    BaseAnalysisRepository,
    AnalysisDatabaseException,
    AnalysisNotFoundException,
)
from app.db.firestore import get_firestore_client
from app.core.logging import logger

_COLLECTION = "analysis"


class FirestoreAnalysisRepository(BaseAnalysisRepository):
    """Persists AI analysis results to the Firestore `analysis/` collection."""

    async def create_analysis(self, payload: dict) -> str:
        """Create a new analysis document and return its ID."""
        try:
            client = get_firestore_client()
            doc_ref = client.collection(_COLLECTION).document()
            doc_ref.set(payload)
            logger.info(
                f"[FirestoreAnalysisRepository] Created analysis document: {doc_ref.id}"
            )
            return doc_ref.id
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreAnalysisRepository] Google Cloud error during create: {gce}"
            )
            raise AnalysisDatabaseException(
                f"Database error creating analysis: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreAnalysisRepository] Unexpected error during create: {exc}"
            )
            raise AnalysisDatabaseException(
                f"Unexpected error creating analysis: {exc}"
            ) from exc

    async def get_analysis(self, analysis_id: str) -> dict | None:
        """Retrieve an analysis document by its ID."""
        try:
            client = get_firestore_client()
            doc = client.collection(_COLLECTION).document(analysis_id).get()
            return doc.to_dict() if doc.exists else None
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreAnalysisRepository] Google Cloud error during get: {gce}"
            )
            raise AnalysisDatabaseException(
                f"Database error retrieving analysis: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreAnalysisRepository] Unexpected error during get: {exc}"
            )
            raise AnalysisDatabaseException(
                f"Unexpected error retrieving analysis: {exc}"
            ) from exc

    async def get_analysis_by_submission(self, submission_id: str) -> dict | None:
        """Retrieve the most recent analysis document for a given submission ID."""
        try:
            client = get_firestore_client()
            docs = (
                client.collection(_COLLECTION)
                .where("submissionId", "==", submission_id)
                .order_by("processedAt", direction="DESCENDING")
                .limit(1)
                .stream()
            )
            for doc in docs:
                return doc.to_dict() | {"analysisId": doc.id}
            return None
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreAnalysisRepository] Google Cloud error during query: {gce}"
            )
            raise AnalysisDatabaseException(
                f"Database error querying analysis by submission: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreAnalysisRepository] Unexpected error during query: {exc}"
            )
            raise AnalysisDatabaseException(
                f"Unexpected error querying analysis by submission: {exc}"
            ) from exc

    async def update_pipeline_state(
        self, analysis_id: str, state: str, state_history: list
    ) -> bool:
        """Update pipeline state and history on an existing analysis document."""
        try:
            client = get_firestore_client()
            doc_ref = client.collection(_COLLECTION).document(analysis_id)
            doc = doc_ref.get()
            if not doc.exists:
                raise AnalysisNotFoundException(
                    f"Analysis document '{analysis_id}' not found."
                )
            doc_ref.update({"pipelineState": state, "stateHistory": state_history})
            return True
        except AnalysisNotFoundException:
            raise
        except GoogleCloudError as gce:
            logger.error(
                f"[FirestoreAnalysisRepository] Google Cloud error during state update: {gce}"
            )
            raise AnalysisDatabaseException(
                f"Database error updating pipeline state: {gce}"
            ) from gce
        except Exception as exc:
            logger.error(
                f"[FirestoreAnalysisRepository] Unexpected error during state update: {exc}"
            )
            raise AnalysisDatabaseException(
                f"Unexpected error updating pipeline state: {exc}"
            ) from exc
