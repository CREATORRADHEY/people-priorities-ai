import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils.request_id import generate_request_id
from app.services.submission_service import SubmissionService
from app.schemas.submission_request import SubmissionRequest
from app.repositories.base_submission_repository import BaseSubmissionRepository, NotFoundException
from app.api.dependencies.repositories import get_submission_repository

# 1. Create a fully functional mock repository for isolated controller/service testing
class MockSubmissionRepository(BaseSubmissionRepository):
    def __init__(self):
        self.submissions = {}
        self.counter = 0

    async def create_submission(self, payload: dict) -> str:
        self.counter += 1
        sub_id = f"mock-sub-{self.counter}"
        self.submissions[sub_id] = payload
        return sub_id

    async def get_submission(self, submission_id: str) -> dict | None:
        return self.submissions.get(submission_id)

    async def update_status(self, submission_id: str, status: str) -> bool:
        if submission_id not in self.submissions:
            raise NotFoundException("Not found")
        self.submissions[submission_id]["status"] = status
        return True

    async def exists(self, submission_id: str) -> bool:
        return submission_id in self.submissions

mock_repo = MockSubmissionRepository()

@pytest.fixture(autouse=True)
def setup_dependency_overrides():
    app.dependency_overrides[get_submission_repository] = lambda: mock_repo
    yield
    app.dependency_overrides.clear()

client = TestClient(app)

def test_health_endpoint():
    """
    Test GET /health returns 200 and healthy status.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "people-priorities-ai"


def test_request_id_generator():
    """
    Test generate_request_id utility format.
    """
    req_id_1 = generate_request_id()
    req_id_2 = generate_request_id()
    
    assert req_id_1.startswith("SUB-")
    assert req_id_2.startswith("SUB-")
    assert len(req_id_1) == 19
    assert req_id_1 != req_id_2


@pytest.mark.anyio
async def test_submission_service_logic():
    """
    Test direct SubmissionService creation using MockSubmissionRepository.
    """
    repo = MockSubmissionRepository()
    service = SubmissionService(repo)
    req_data = {
        "version": "1.0.0",
        "createdAt": "2026-07-07T09:00:00Z",
        "information": {
            "title": "Road pothole",
            "description": "Large pothole causing traffic issues",
            "category": "Roads",
            "language": "en"
        }
    }
    req_model = SubmissionRequest(**req_data)
    result = await service.create_submission(req_model, "SUB-20260707-123456")
    
    assert result["success"] is True
    assert result["requestId"] == "SUB-20260707-123456"
    assert result["status"] == "received"
    assert result["data"]["submissionId"] == "mock-sub-1"
    
    # Assert payload was persisted with correct schema mappings
    persisted = await repo.get_submission("mock-sub-1")
    assert persisted is not None
    assert persisted["schemaVersion"] == "1.0.0"
    assert persisted["status"] == "RECEIVED"
    assert "serverCreatedAt" in persisted


def test_valid_submission_post():
    """
    Test POST /api/v1/submissions with a fully complete valid payload.
    """
    payload = {
        "version": "1.0.0",
        "createdAt": "2026-07-07T09:00:00Z",
        "information": {
            "title": "Broken streetlight",
            "description": "Streetlight has been flickering for a week.",
            "category": "Electricity",
            "language": "en"
        },
        "voice": {
            "duration": 12.5
        },
        "images": [
            {
                "filename": "light.jpg",
                "mimeType": "image/jpeg",
                "size": 250000
            }
        ],
        "location": {
            "latitude": 12.971598,
            "longitude": 77.594562,
            "accuracy": 5.0,
            "locality": "MG Road",
            "ward": "Ward 12",
            "landmark": "Near Metro",
            "source": "gps",
            "capturedAt": "2026-07-07T08:58:00Z"
        }
    }
    
    response = client.post("/api/v1/submissions", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert "requestId" in data
    assert data["requestId"].startswith("SUB-")
    assert data["status"] == "received"
    assert "data" in data
    assert "submissionId" in data["data"]
    assert data["data"]["submissionId"].startswith("mock-sub-")


def test_invalid_submission_post_missing_fields():
    """
    Test POST /api/v1/submissions rejects missing category and title fields.
    """
    invalid_payload = {
        "version": "1.0.0",
        "createdAt": "2026-07-07T09:00:00Z",
        "information": {
            "description": "Broken pipe leaking water.",
            "language": "en"
        }
    }
    
    response = client.post("/api/v1/submissions", json=invalid_payload)
    assert response.status_code == 422
    
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert len(data["error"]["details"]) > 0


def test_invalid_submission_post_empty_payload():
    """
    Test POST /api/v1/submissions rejects empty payload.
    """
    response = client.post("/api/v1/submissions", json={})
    assert response.status_code == 422
    
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
