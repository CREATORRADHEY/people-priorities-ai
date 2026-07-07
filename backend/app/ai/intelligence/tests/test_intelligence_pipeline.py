"""
test_intelligence_pipeline.py — IntelligencePipeline Orchestrator Unit Tests
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from app.ai.intelligence.pipeline.intelligence_pipeline import IntelligencePipeline
from app.ai.intelligence.repositories.base_intelligence_repository import (
    BaseIntelligenceRepository,
    IntelligenceDatabaseException,
)

# ── Fixtures & Mocks ──────────────────────────────────────────────────────────

_ANALYSIS_DATA = {
    "analysisId": "anal-123",
    "category": "Water Supply",
    "themes": ["drinking water", "tap water"],
    "confidence": 0.90,
    "summary": "Water is dirty and supply is low.",
}

_SUBMISSION_DATA = {
    "location": {
        "locality": "Ward 12",
        "ward": "Ward 12",
        "district": "Delhi",
    }
}


class MockIntelligenceRepository(BaseIntelligenceRepository):
    def __init__(self, fail_on_create=False):
        self.docs = {}
        self.state_updates = []
        self.fail_on_create = fail_on_create
        self.counter = 0

    async def create_intelligence(self, payload: dict) -> str:
        if self.fail_on_create:
            raise IntelligenceDatabaseException("Firestore unavailable")
        self.counter += 1
        doc_id = f"intel-{self.counter}"
        self.docs[doc_id] = payload
        return doc_id

    async def get_intelligence(self, intelligence_id: str) -> dict | None:
        return self.docs.get(intelligence_id)

    async def get_intelligence_by_submission(self, submission_id: str) -> dict | None:
        return None

    async def update_ie_state(self, intelligence_id: str, state: str, state_history: list) -> bool:
        self.state_updates.append({"id": intelligence_id, "state": state})
        if intelligence_id in self.docs:
            self.docs[intelligence_id]["ieState"] = state
            self.docs[intelligence_id]["stateHistory"] = state_history
        return True


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_pipeline_happy_path():
    repo = MockIntelligenceRepository()
    pipeline = IntelligencePipeline(repository=repo)

    # Patch firestore candidate loading and final persistence call
    with patch.object(pipeline, "_fetch_recent_analysis_candidates", new_callable=AsyncMock) as mock_candidates, \
         patch("app.ai.intelligence.pipeline.intelligence_pipeline.get_firestore_client") as mock_fs:
        mock_candidates.return_value = []
        mock_fs_client = MagicMock()
        mock_fs.return_value = mock_fs_client

        res = await pipeline.run(
            submission_id="sub-123",
            analysis_data=_ANALYSIS_DATA,
            submission_data=_SUBMISSION_DATA,
            request_id="req-123",
        )

        assert res["success"] is True
        assert res["ie_state"] == "COMPLETED"
        intel_id = res["intelligence_id"]
        assert intel_id == "intel-1"

        intel = res["intelligence"]
        assert intel.primaryCategory == "Water Supply"
        assert intel.priorityLevel == "MEDIUM"
        assert "Department of Water Resources & Sanitation" in intel.recommendedDepartment

        # Ensure the final merge set call was made on firestore
        mock_fs_client.collection.assert_called_once_with("intelligence")




@pytest.mark.asyncio
async def test_pipeline_bootstrap_failure():
    repo = MockIntelligenceRepository(fail_on_create=True)
    pipeline = IntelligencePipeline(repository=repo)

    res = await pipeline.run(
        submission_id="sub-123",
        analysis_data=_ANALYSIS_DATA,
        submission_data=_SUBMISSION_DATA,
        request_id="req-123",
    )

    assert res["success"] is False
    assert "Failed to bootstrap" in res["error"]


@pytest.mark.asyncio
async def test_pipeline_exception_handling():
    repo = MockIntelligenceRepository()
    pipeline = IntelligencePipeline(repository=repo)

    # Trigger exception by throwing inside candidate fetch
    with patch.object(pipeline, "_fetch_recent_analysis_candidates", side_effect=ValueError("Firestore timeout")):
        res = await pipeline.run(
            submission_id="sub-123",
            analysis_data=_ANALYSIS_DATA,
            submission_data=_SUBMISSION_DATA,
            request_id="req-123",
        )

        assert res["success"] is False
        assert res["ie_state"] == "FAILED"
        assert "Firestore timeout" in res["error"]

        # ieState of bootstrap doc should be transitioned to FAILED
        doc = await repo.get_intelligence("intel-1")
        assert doc["ieState"] == "FAILED"
