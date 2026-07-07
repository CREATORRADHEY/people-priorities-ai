import pytest
from unittest.mock import MagicMock, patch
from google.cloud.exceptions import GoogleCloudError
from app.repositories.submission_repository import FirestoreSubmissionRepository
from app.repositories.base_submission_repository import DatabaseException, NotFoundException

@pytest.fixture
def mock_firestore_client():
    with patch("app.repositories.submission_repository.get_firestore_client") as mock_get:
        mock_client = MagicMock()
        mock_get.return_value = mock_client
        yield mock_client

@pytest.mark.anyio
async def test_repository_create_submission_success(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.id = "doc-123-xyz"
    mock_firestore_client.collection.return_value.document.return_value = mock_doc
    
    payload = {"title": "Test Issue", "status": "RECEIVED"}
    doc_id = await repo.create_submission(payload)
    
    assert doc_id == "doc-123-xyz"
    mock_firestore_client.collection.assert_called_once_with("submissions")
    mock_doc.set.assert_called_once_with(payload)

@pytest.mark.anyio
async def test_repository_create_submission_db_error(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.set.side_effect = GoogleCloudError("Connection lost")
    mock_firestore_client.collection.return_value.document.return_value = mock_doc
    
    with pytest.raises(DatabaseException) as exc_info:
        await repo.create_submission({"title": "Test Issue"})
    assert "Database error during creation" in str(exc_info.value)

@pytest.mark.anyio
async def test_repository_get_submission_success(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_doc.to_dict.return_value = {"title": "Test Retrieve"}
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    result = await repo.get_submission("doc-123")
    assert result == {"title": "Test Retrieve"}

@pytest.mark.anyio
async def test_repository_get_submission_not_found(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = False
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    result = await repo.get_submission("non-existent")
    assert result is None

@pytest.mark.anyio
async def test_repository_update_status_success(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    success = await repo.update_status("doc-123", "PROCESSING_AI")
    assert success is True
    mock_firestore_client.collection.return_value.document.return_value.update.assert_called_once_with(
        {"status": "PROCESSING_AI"}
    )

@pytest.mark.anyio
async def test_repository_update_status_not_found(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = False
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    with pytest.raises(NotFoundException):
        await repo.update_status("non-existent", "PROCESSING_AI")

@pytest.mark.anyio
async def test_repository_exists_true(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    result = await repo.exists("doc-123")
    assert result is True

@pytest.mark.anyio
async def test_repository_exists_false(mock_firestore_client):
    repo = FirestoreSubmissionRepository()
    mock_doc = MagicMock()
    mock_doc.exists = False
    mock_firestore_client.collection.return_value.document.return_value.get.return_value = mock_doc
    
    result = await repo.exists("doc-123")
    assert result is False
