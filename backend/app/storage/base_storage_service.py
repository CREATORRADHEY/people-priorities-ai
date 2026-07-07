from abc import ABC, abstractmethod

class StorageException(Exception):
    """Base exception for all storage service failures."""
    pass

class BaseStorageService(ABC):
    @abstractmethod
    async def upload_voice(self, submission_id: str, file_data: bytes, filename: str) -> str:
        """
        Uploads a voice recording file to storage under submissions/{submission_id}/voice/
        Returns the storage path.
        Raises StorageException on failure.
        """
        pass

    @abstractmethod
    async def upload_image(self, submission_id: str, file_data: bytes, filename: str) -> str:
        """
        Uploads an image file to storage under submissions/{submission_id}/images/
        Returns the storage path.
        Raises StorageException on failure.
        """
        pass

    @abstractmethod
    async def delete_file(self, storage_path: str) -> bool:
        """
        Deletes a file from storage.
        Returns True if successful, False otherwise.
        Raises StorageException on failure.
        """
        pass

    @abstractmethod
    async def get_download_url(self, storage_path: str) -> str:
        """
        Generates a secure or public download URL for the given storage path.
        Returns the download URL string.
        Raises StorageException on failure.
        """
        pass
