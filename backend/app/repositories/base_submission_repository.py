from abc import ABC, abstractmethod

class RepositoryException(Exception):
    """Base exception for all repository operations."""
    pass

class DatabaseException(RepositoryException):
    """Exception raised when a database read/write operation fails."""
    pass

class NotFoundException(RepositoryException):
    """Exception raised when a requested resource is not found."""
    pass

class BaseSubmissionRepository(ABC):
    @abstractmethod
    async def create_submission(self, payload: dict) -> str:
        """
        Creates a new submission record with the given payload.
        Returns the generated submission ID.
        Raises DatabaseException on failure.
        """
        pass

    @abstractmethod
    async def get_submission(self, submission_id: str) -> dict | None:
        """
        Retrieves a submission record by its ID.
        Returns the submission dictionary or None if not found.
        Raises DatabaseException on failure.
        """
        pass

    @abstractmethod
    async def update_status(self, submission_id: str, status: str) -> bool:
        """
        Updates the status field of a submission.
        Returns True if successful, raises NotFoundException if the document doesn't exist.
        Raises DatabaseException on database error.
        """
        pass

    @abstractmethod
    async def exists(self, submission_id: str) -> bool:
        """
        Checks if a submission with the given ID exists.
        Returns True if present, False otherwise.
        Raises DatabaseException on failure.
        """
        pass
