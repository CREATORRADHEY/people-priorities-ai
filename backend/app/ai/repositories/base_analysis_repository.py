"""
base_analysis_repository.py

Abstract repository contract for analysis document persistence.

Mirrors the BaseSubmissionRepository pattern from FP-2.2 so the
pipeline is completely decoupled from the Firestore implementation.
The concrete FirestoreAnalysisRepository can be swapped for a test
double without touching any pipeline code.
"""
from abc import ABC, abstractmethod


class AnalysisDatabaseException(Exception):
    """Raised when the analysis repository encounters a storage error."""
    pass


class AnalysisNotFoundException(Exception):
    """Raised when a requested analysis document does not exist."""
    pass


class BaseAnalysisRepository(ABC):
    """
    Abstract contract for analysis persistence.

    All methods map directly to AAD-01 Section 11 document operations.
    """

    @abstractmethod
    async def create_analysis(self, payload: dict) -> str:
        """
        Persist a new analysis document.

        Args:
            payload: Serialized AnalysisResult dict.

        Returns:
            The newly created Firestore document ID (analysisId).

        Raises:
            AnalysisDatabaseException: On storage errors.
        """
        ...

    @abstractmethod
    async def get_analysis(self, analysis_id: str) -> dict | None:
        """
        Retrieve an analysis document by its document ID.

        Returns None if not found (does not raise AnalysisNotFoundException).
        """
        ...

    @abstractmethod
    async def get_analysis_by_submission(self, submission_id: str) -> dict | None:
        """
        Retrieve the most recent analysis for a given submission ID.

        Returns None if no analysis exists yet.
        """
        ...

    @abstractmethod
    async def update_pipeline_state(
        self, analysis_id: str, state: str, state_history: list
    ) -> bool:
        """
        Update the pipelineState and stateHistory fields on an existing document.

        Used by the pipeline to persist every state transition, not just the final one.

        Raises:
            AnalysisNotFoundException: If the document does not exist.
            AnalysisDatabaseException: On storage errors.
        """
        ...
