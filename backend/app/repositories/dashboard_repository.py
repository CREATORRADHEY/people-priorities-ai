"""
dashboard_repository.py — Repository layer for the MP Dashboard.

Performs read queries across the submissions, analysis, and intelligence collections.
Provides bulk/batch loading methods to prevent N+1 query patterns.
"""
from abc import ABC, abstractmethod
from google.cloud.exceptions import GoogleCloudError
from google.cloud.firestore_v1.field_path import FieldPath




from app.db.firestore import get_firestore_client
from app.repositories.base_submission_repository import DatabaseException
from app.core.logging import logger

_SUBMISSIONS_COL = "submissions"
_ANALYSIS_COL = "analysis"
_INTELLIGENCE_COL = "intelligence"


class BaseDashboardRepository(ABC):
    """
    Abstract contract for dashboard read-only queries.
    """

    @abstractmethod
    async def get_all_submissions(self) -> list[dict]:
        """Fetch all submissions from the database."""
        ...

    @abstractmethod
    async def get_all_intelligence(self) -> list[dict]:
        """Fetch all intelligence documents."""
        ...

    @abstractmethod
    async def get_all_analysis(self) -> list[dict]:
        """Fetch all analysis documents."""
        ...

    @abstractmethod
    async def batch_get_submissions(self, ids: list[str]) -> dict[str, dict]:
        """Fetch submissions matching the list of IDs in a single query."""
        ...

    @abstractmethod
    async def batch_get_analysis(self, ids: list[str]) -> dict[str, dict]:
        """Fetch analysis documents matching the list of IDs in a single query."""
        ...

    @abstractmethod
    async def batch_get_intelligence(self, ids: list[str]) -> dict[str, dict]:
        """Fetch intelligence documents matching the list of IDs in a single query."""
        ...


class FirestoreDashboardRepository(BaseDashboardRepository):
    """
    Concrete Firestore implementation of BaseDashboardRepository.
    """

    async def get_all_submissions(self) -> list[dict]:
        try:
            client = get_firestore_client()
            docs = client.collection(_SUBMISSIONS_COL).stream()
            return [d.to_dict() | {"id": d.id} for d in docs]
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] get_all_submissions failed: {gce}")
            raise DatabaseException(f"Database error fetching submissions: {gce}") from gce

    async def get_all_intelligence(self) -> list[dict]:
        try:
            client = get_firestore_client()
            docs = client.collection(_INTELLIGENCE_COL).stream()
            return [d.to_dict() | {"id": d.id} for d in docs]
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] get_all_intelligence failed: {gce}")
            raise DatabaseException(f"Database error fetching intelligence: {gce}") from gce

    async def get_all_analysis(self) -> list[dict]:
        try:
            client = get_firestore_client()
            docs = client.collection(_ANALYSIS_COL).stream()
            return [d.to_dict() | {"id": d.id} for d in docs]
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] get_all_analysis failed: {gce}")
            raise DatabaseException(f"Database error fetching analysis: {gce}") from gce

    async def batch_get_submissions(self, ids: list[str]) -> dict[str, dict]:
        if not ids:
            return {}
        try:
            client = get_firestore_client()
            results = {}
            # Firestore 'in' query allows up to 30 IDs per chunk
            for chunk in _chunk_list(ids, 30):
                docs = client.collection(_SUBMISSIONS_COL).where(FieldPath.document_id(), "in", chunk).stream()
                for doc in docs:
                    results[doc.id] = doc.to_dict() | {"id": doc.id}
            return results
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] batch_get_submissions failed: {gce}")
            raise DatabaseException(f"Database error batch loading submissions: {gce}") from gce

    async def batch_get_analysis(self, ids: list[str]) -> dict[str, dict]:
        if not ids:
            return {}
        try:
            client = get_firestore_client()
            results = {}
            for chunk in _chunk_list(ids, 30):
                docs = client.collection(_ANALYSIS_COL).where("submissionId", "in", chunk).stream()
                for doc in docs:
                    data = doc.to_dict() | {"analysisId": doc.id}
                    sub_id = data.get("submissionId")
                    if sub_id:
                        results[sub_id] = data
            return results
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] batch_get_analysis failed: {gce}")
            raise DatabaseException(f"Database error batch loading analysis: {gce}") from gce

    async def batch_get_intelligence(self, ids: list[str]) -> dict[str, dict]:
        if not ids:
            return {}
        try:
            client = get_firestore_client()
            results = {}
            for chunk in _chunk_list(ids, 30):
                docs = client.collection(_INTELLIGENCE_COL).where("submissionId", "in", chunk).stream()
                for doc in docs:
                    data = doc.to_dict() | {"intelligenceId": doc.id}
                    sub_id = data.get("submissionId")
                    if sub_id:
                        results[sub_id] = data
            return results
        except GoogleCloudError as gce:
            logger.error(f"[FirestoreDashboardRepository] batch_get_intelligence failed: {gce}")
            raise DatabaseException(f"Database error batch loading intelligence: {gce}") from gce


def _chunk_list(lst: list, size: int):
    """Helper to partition list into chunks of fixed size."""
    for i in range(0, len(lst), size):
        yield lst[i:i + size]
