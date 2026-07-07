from app.repositories.base_submission_repository import BaseSubmissionRepository
from app.repositories.submission_repository import FirestoreSubmissionRepository
from app.repositories.storage_repository import BaseStorageRepository, FirestoreStorageRepository

def get_submission_repository() -> BaseSubmissionRepository:
    """
    Dependency provider that returns the concrete FirestoreSubmissionRepository instance.
    """
    return FirestoreSubmissionRepository()

def get_storage_repository() -> BaseStorageRepository:
    """
    Dependency provider that returns the concrete FirestoreStorageRepository instance.
    """
    return FirestoreStorageRepository()
