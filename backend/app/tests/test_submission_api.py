import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils.request_id import generate_request_id
from app.services.submission_service import SubmissionService
from app.schemas.submission_request import SubmissionRequest

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


def test_submission_service_logic():
    """
    Test direct SubmissionService creation return payload.
    """
    service = SubmissionService()
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
    # Validate request structure first
    req_model = SubmissionRequest(**req_data)
    result = service.create_submission(req_model, "SUB-20260707-123456")
    
    assert result["success"] is True
    assert result["requestId"] == "SUB-20260707-123456"
    assert result["status"] == "accepted"


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
    assert data["status"] == "accepted"


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
            # Missing 'title' and 'category'
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
