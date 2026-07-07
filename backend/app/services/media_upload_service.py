from datetime import datetime
from fastapi import UploadFile, HTTPException, status
from app.storage.base_storage_service import BaseStorageService
from app.repositories.storage_repository import BaseStorageRepository
from app.repositories.base_submission_repository import BaseSubmissionRepository
from app.core.logging import logger

class MediaUploadService:
    def __init__(
        self,
        storage_service: BaseStorageService,
        storage_repo: BaseStorageRepository,
        submission_repo: BaseSubmissionRepository
    ):
        self.storage_service = storage_service
        self.storage_repo = storage_repo
        self.submission_repo = submission_repo

    async def upload_media(
        self,
        submission_id: str,
        voice_file: UploadFile | None,
        image_files: list[UploadFile],
        request_id: str
    ) -> dict:
        """
        Coordinates raw media uploads to Firebase Storage, generates download URLs,
        and saves consistent MediaReference records into the Firestore submission document.
        Updates status to 'UPLOADED'.
        """
        # 1. Verify target submission exists
        submission = await self.submission_repo.get_submission(submission_id)
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Submission with ID {submission_id} does not exist."
            )

        voice_ref = None
        image_refs = []

        # 2. Validate and Process Voice Upload
        if voice_file:
            content_type = voice_file.content_type or ""
            filename = voice_file.filename or "audio.webm"
            lower_name = filename.lower()
            
            # Rule: WebM format only
            is_webm = "webm" in content_type.lower() or lower_name.endswith(".webm")
            if not is_webm:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid voice recording format. Only WebM audio is allowed."
                )

            file_bytes = await voice_file.read()
            # Perform upload via storage service abstraction
            storage_path = await self.storage_service.upload_voice(
                submission_id, file_bytes, filename
            )
            download_url = await self.storage_service.get_download_url(storage_path)

            # Retrieve existing client metadata
            existing_voice_meta = submission.get("voice") or {}
            duration = existing_voice_meta.get("duration", 0.0)

            # Save MediaReference fields
            voice_ref = {
                "storage_path": storage_path,
                "download_url": download_url,
                "mime_type": "audio/webm",
                "size": len(file_bytes),
                "uploaded_at": datetime.utcnow().isoformat() + "Z",
                "duration": duration
            }

        # 3. Validate and Process Image Uploads
        if image_files:
            # Rule: Max 3 images
            if len(image_files) > 3:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Maximum of 3 images can be uploaded per submission."
                )

            for idx, img in enumerate(image_files):
                content_type = img.content_type or ""
                filename = img.filename or f"image_{idx + 1}.jpg"
                lower_name = filename.lower()

                # Rule: JPG, PNG, WEBP formats only
                is_valid_format = (
                    "jpeg" in content_type.lower() or 
                    "jpg" in content_type.lower() or
                    "png" in content_type.lower() or
                    "webp" in content_type.lower() or
                    lower_name.endswith((".jpg", ".jpeg", ".png", ".webp"))
                )
                if not is_valid_format:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid image format for file '{filename}'. Only JPG, PNG, and WEBP are allowed."
                    )

                img_bytes = await img.read()
                storage_path = await self.storage_service.upload_image(
                    submission_id, img_bytes, filename
                )
                download_url = await self.storage_service.get_download_url(storage_path)

                # Map exact MIME type string
                mime_type = "image/jpeg"
                if lower_name.endswith(".png"):
                    mime_type = "image/png"
                elif lower_name.endswith(".webp"):
                    mime_type = "image/webp"

                # Append MediaReference fields
                image_refs.append({
                    "storage_path": storage_path,
                    "download_url": download_url,
                    "mime_type": mime_type,
                    "size": len(img_bytes),
                    "uploaded_at": datetime.utcnow().isoformat() + "Z"
                })

        # 4. Save metadata references to Firestore document
        await self.storage_repo.save_media_references(submission_id, voice_ref, image_refs)

        # 5. Transition Firestore submission status to UPLOADED
        await self.submission_repo.update_status(submission_id, "UPLOADED")

        logger.info(
            f"[{request_id}] [MediaUploadService] Media successfully uploaded for submission: {submission_id}"
        )

        return {
            "success": True,
            "requestId": request_id,
            "status": "uploaded",
            "data": {
                "submissionId": submission_id,
                "voiceUploaded": voice_file is not None,
                "imagesUploaded": len(image_files)
            }
        }
