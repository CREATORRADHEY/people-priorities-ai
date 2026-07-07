"""
base_intelligence_repository.py

Abstract repository contract for intelligence document persistence.
Allows the concrete Firestore implementation to be swapped during testing.
"""
from abc import ABC, abstractmethod


class IntelligenceDatabaseException(Exception):
    """Raised when the intelligence repository encounters a database error."""
    pass


class IntelligenceNotFoundException(Exception):
    """Raised when a requested intelligence document does not exist."""
    pass


class BaseIntelligenceRepository(ABC):
    """
    Abstract contract for intelligence persistence.
    """

    @abstractmethod
    async def create_intelligence(self, payload: dict) -> str:
        """
        Persist a new intelligence document.

        Args:
            payload: Serialized IntelligenceResult dict.

        Returns:
            The newly created Firestore document ID (intelligenceId).

        Raises:
            IntelligenceDatabaseException: On database/storage errors.
        """
        ...

    @abstractmethod
    async def get_intelligence(self, intelligence_id: str) -> dict | None:
        """
        Retrieve an intelligence document by its document ID.

        Returns None if not found.
        """
        ...

    @abstractmethod
    async def get_intelligence_by_submission(self, submission_id: str) -> dict | None:
        """
        Retrieve the intelligence document for a given submission ID.

        Returns None if no intelligence exists yet.
        """
        ...

    @abstractmethod
    async def update_ie_state(
        self, intelligence_id: str, state: str, state_history: list
    ) -> bool:
        """
        Update the ieState and stateHistory fields on an existing document.

        Used to persist every pipeline state transition for audit logs.

        Raises:
            IntelligenceNotFoundException: If the document does not exist.
            IntelligenceDatabaseException: On database errors.
        """
        ...
