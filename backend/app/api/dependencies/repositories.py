from app.repositories.base_submission_repository import BaseSubmissionRepository
from app.repositories.submission_repository import FirestoreSubmissionRepository

def get_submission_repository() -> BaseSubmissionRepository:
    """
    Dependency provider that returns the concrete FirestoreSubmissionRepository instance.
    """
    return FirestoreSubmissionRepository()
