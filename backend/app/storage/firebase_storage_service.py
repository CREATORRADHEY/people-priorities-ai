import urllib.parse
import firebase_admin.storage
from app.storage.base_storage_service import BaseStorageService, StorageException
from app.core.logging import logger

class FirebaseStorageService(BaseStorageService):
    def __init__(self):
        try:
            self.bucket = firebase_admin.storage.bucket()
        except Exception as e:
            logger.warning(
                f"[FirebaseStorageService] Firebase Storage bucket not initialized: {e}. "
                "Running in fallback/mock mode."
            )
            self.bucket = None

    async def upload_voice(self, submission_id: str, file_data: bytes, filename: str) -> str:
        storage_path = f"submissions/{submission_id}/voice/{filename}"
        return await self._upload(storage_path, file_data, "audio/webm")

    async def upload_image(self, submission_id: str, file_data: bytes, filename: str) -> str:
        # Determine MIME type based on filename extension
        mime_type = "image/jpeg"
        lower_name = filename.lower()
        if lower_name.endswith(".png"):
            mime_type = "image/png"
        elif lower_name.endswith(".webp"):
            mime_type = "image/webp"

        storage_path = f"submissions/{submission_id}/images/{filename}"
        return await self._upload(storage_path, file_data, mime_type)

    async def _upload(self, storage_path: str, file_data: bytes, mime_type: str) -> str:
        try:
            if not self.bucket:
                logger.info(f"[Mock Storage] Uploaded {len(file_data)} bytes to '{storage_path}'")
                return storage_path

            blob = self.bucket.blob(storage_path)
            blob.upload_from_string(file_data, content_type=mime_type)
            return storage_path
        except Exception as e:
            logger.error(f"[FirebaseStorageService] Upload failed for '{storage_path}': {e}")
            raise StorageException(f"Upload failed: {e}") from e

    async def delete_file(self, storage_path: str) -> bool:
        try:
            if not self.bucket:
                logger.info(f"[Mock Storage] Deleted file '{storage_path}'")
                return True

            blob = self.bucket.blob(storage_path)
            if blob.exists():
                blob.delete()
            return True
        except Exception as e:
            logger.error(f"[FirebaseStorageService] Delete failed for '{storage_path}': {e}")
            raise StorageException(f"Delete failed: {e}") from e

    async def get_download_url(self, storage_path: str) -> str:
        try:
            bucket_name = self.bucket.name if self.bucket else "mock-bucket"
            # Firebase Storage standard public media download URL format:
            # https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{urlencoded_path}?alt=media
            encoded_path = urllib.parse.quote(storage_path, safe='')
            return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media"
        except Exception as e:
            logger.error(f"[FirebaseStorageService] Failed to generate URL for '{storage_path}': {e}")
            raise StorageException(f"Download URL generation failed: {e}") from e
