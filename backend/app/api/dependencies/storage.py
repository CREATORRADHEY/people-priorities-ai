from app.storage.base_storage_service import BaseStorageService
from app.storage.firebase_storage_service import FirebaseStorageService

def get_storage_service() -> BaseStorageService:
    """
    Dependency provider that returns the concrete FirebaseStorageService instance.
    """
    return FirebaseStorageService()
