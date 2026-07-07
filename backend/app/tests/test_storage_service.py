import pytest
from io import BytesIO
from fastapi import HTTPException
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch, AsyncMock
from app.main import app
from app.storage.base_storage_service import StorageException
from app.storage.firebase_storage_service import FirebaseStorageService
from app.services.media_upload_service import MediaUploadService
from app.repositories.base_submission_repository import BaseSubmissionRepository, NotFoundException
from app.repositories.storage_repository import BaseStorageRepository
from app.api.dependencies.repositories import get_submission_repository, get_storage_repository
from app.api.dependencies.storage import get_storage_service

# 1. Create fully operational mock testing dependencies
class MockSubmissionRepository(BaseSubmissionRepository):
    def __init__(self):
        self.submissions = {
            "sub-111": {
                "schemaVersion": "1.0.0",
                "status": "RECEIVED",
                "createdAt": "2026-07-07T09:00:00Z",
                "information": {
                    "title": "Broken pipe",
                    "description": "Leaking water",
                    "category": "Water",
                    "language": "en"
                },
                "voice": {"duration": 45.2}
            }
        }

    async def create_submission(self, payload: dict) -> str:
        return "sub-111"

    async def get_submission(self, submission_id: str) -> dict | None:
        return self.submissions.get(submission_id)

    async def update_status(self, submission_id: str, status: str) -> bool:
        if submission_id not in self.submissions:
            raise NotFoundException()
        self.submissions[submission_id]["status"] = status
        return True

    async def exists(self, submission_id: str) -> bool:
        return submission_id in self.submissions


class MockStorageRepository(BaseStorageRepository):
    def __init__(self):
        self.references = {}

    async def save_media_references(self, submission_id: str, voice: dict | None, images: list[dict]) -> bool:
        self.references[submission_id] = {
            "voice": voice,
            "images": images
        }
        return True


class MockStorageService:
    async def upload_voice(self, submission_id: str, file_data: bytes, filename: str) -> str:
        return f"submissions/{submission_id}/voice/{filename}"

    async def upload_image(self, submission_id: str, file_data: bytes, filename: str) -> str:
        return f"submissions/{submission_id}/images/{filename}"

    async def delete_file(self, storage_path: str) -> bool:
        return True

    async def get_download_url(self, storage_path: str) -> str:
        return f"https://firebasestorage.googleapis.com/v0/b/mock-bucket/o/{storage_path}?alt=media"


mock_sub_repo = MockSubmissionRepository()
mock_storage_repo = MockStorageRepository()
mock_storage_svc = MockStorageService()

@pytest.fixture(autouse=True)
def setup_dependency_overrides():
    app.dependency_overrides[get_submission_repository] = lambda: mock_sub_repo
    app.dependency_overrides[get_storage_repository] = lambda: mock_storage_repo
    app.dependency_overrides[get_storage_service] = lambda: mock_storage_svc
    yield
    app.dependency_overrides.clear()

client = TestClient(app)

# ==================== UNIT TESTS FOR FIREBASE STORAGE SERVICE ====================

@patch("app.storage.firebase_storage_service.firebase_admin.storage.bucket")
def test_firebase_storage_service_init_failure(mock_bucket):
    # Test initialization fallback mode when default firebase credentials are not configured
    mock_bucket.side_effect = Exception("No credentials")
    service = FirebaseStorageService()
    assert service.bucket is None


@patch("app.storage.firebase_storage_service.firebase_admin.storage.bucket")
@pytest.mark.anyio
async def test_firebase_storage_service_upload_success(mock_bucket):
    mock_bucket_instance = MagicMock()
    mock_bucket.return_value = mock_bucket_instance
    service = FirebaseStorageService()
    
    storage_path = await service.upload_image("sub-123", b"fake-bytes", "test.jpg")
    assert storage_path == "submissions/sub-123/images/test.jpg"
    mock_bucket_instance.blob.assert_called_once_with("submissions/sub-123/images/test.jpg")
    mock_bucket_instance.blob.return_value.upload_from_string.assert_called_once()


# ==================== MEDIA UPLOAD SERVICE RULES & FLOWS ====================

@pytest.mark.anyio
async def test_media_upload_service_voice_validation_error():
    service = MediaUploadService(mock_storage_svc, mock_storage_repo, mock_sub_repo)
    
    # Mock voice file with invalid mime type
    invalid_voice = MagicMock()
    invalid_voice.content_type = "audio/mp3"
    invalid_voice.filename = "recording.mp3"
    
    with pytest.raises(HTTPException) as exc_info:
        await service.upload_media("sub-111", invalid_voice, [], "REQ-1")
    assert exc_info.value.status_code == 400
    assert "Only WebM audio is allowed" in exc_info.value.detail


@pytest.mark.anyio
async def test_media_upload_service_image_count_limit_error():
    service = MediaUploadService(mock_storage_svc, mock_storage_repo, mock_sub_repo)
    
    # Mock four image files
    images = []
    for i in range(4):
        img = MagicMock()
        img.content_type = "image/jpeg"
        img.filename = f"img_{i}.jpg"
        images.append(img)
        
    with pytest.raises(HTTPException) as exc_info:
        await service.upload_media("sub-111", None, images, "REQ-1")
    assert exc_info.value.status_code == 400
    assert "Maximum of 3 images" in exc_info.value.detail


@pytest.mark.anyio
async def test_media_upload_service_image_format_validation_error():
    service = MediaUploadService(mock_storage_svc, mock_storage_repo, mock_sub_repo)
    
    # Mock image with invalid extension
    invalid_img = MagicMock()
    invalid_img.content_type = "image/gif"
    invalid_img.filename = "animation.gif"
    
    with pytest.raises(HTTPException) as exc_info:
        await service.upload_media("sub-111", None, [invalid_img], "REQ-1")
    assert exc_info.value.status_code == 400
    assert "Only JPG, PNG, and WEBP are allowed" in exc_info.value.detail


@pytest.mark.anyio
async def test_media_upload_service_valid_uploads():
    service = MediaUploadService(mock_storage_svc, mock_storage_repo, mock_sub_repo)
    
    # Setup mock files
    voice = MagicMock()
    voice.content_type = "audio/webm"
    voice.filename = "audio.webm"
    voice.read = AsyncMock(return_value=b"voice-bytes")
    
    img = MagicMock()
    img.content_type = "image/png"
    img.filename = "evidence.png"
    img.read = AsyncMock(return_value=b"image-bytes")
    
    result = await service.upload_media("sub-111", voice, [img], "REQ-100")
    
    assert result["success"] is True
    assert result["status"] == "uploaded"
    assert result["data"]["submissionId"] == "sub-111"
    assert result["data"]["voiceUploaded"] is True
    assert result["data"]["imagesUploaded"] == 1
    
    # Verify Firestore metadata structures match MediaReference model requirements
    persisted_references = mock_storage_repo.references["sub-111"]
    assert persisted_references["voice"] is not None
    assert persisted_references["voice"]["storage_path"] == "submissions/sub-111/voice/audio.webm"
    assert persisted_references["voice"]["mime_type"] == "audio/webm"
    assert persisted_references["voice"]["size"] == len(b"voice-bytes")
    assert persisted_references["voice"]["duration"] == 45.2  # Reads from submission document
    
    assert len(persisted_references["images"]) == 1
    assert persisted_references["images"][0]["storage_path"] == "submissions/sub-111/images/evidence.png"
    assert persisted_references["images"][0]["mime_type"] == "image/png"
    
    # Verify status transition
    assert mock_sub_repo.submissions["sub-111"]["status"] == "UPLOADED"


# ==================== ENDPOINT INTEGRATION TESTS ====================

def test_api_upload_endpoint_success():
    # Simulate standard HTTP upload payload using FastAPI test client
    voice_content = b"voice-payload-mock"
    image_content = b"image-payload-mock"
    
    files = [
        ("voice", ("voice.webm", voice_content, "audio/webm")),
        ("images", ("pic.jpg", image_content, "image/jpeg"))
    ]
    
    response = client.post(
        "/api/v1/submissions/sub-111/media",
        files=files
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "uploaded"
    assert data["data"]["submissionId"] == "sub-111"
    assert data["data"]["voiceUploaded"] is True
    assert data["data"]["imagesUploaded"] == 1


def test_api_upload_endpoint_not_found():
    response = client.post(
        "/api/v1/submissions/non-existent-sub/media",
        files={"voice": ("recording.webm", b"...", "audio/webm")}
    )
    assert response.status_code == 404
