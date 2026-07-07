"""
test_dashboard.py — Unit tests for the DashboardService and REST APIs.

Mocks the repository layer to test summary math, priorities sorting, hotspot grouping,
and error handling on empty datasets.
"""
from fastapi import status
from fastapi.testclient import TestClient
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.main import app
from app.repositories.dashboard_repository import BaseDashboardRepository
from app.services.dashboard_service import DashboardService
from app.api.dependencies.dashboard import get_dashboard_service

client = TestClient(app)


# ── Mock Data ─────────────────────────────────────────────────────────────────

MOCK_SUBMISSIONS = [
    {
        "id": "sub-1",
        "information": {"issueDescription": "Water leakage on Main St", "category": "Water Supply"},
        "location": {"locality": "Ward 1"}
    },
    {
        "id": "sub-2",
        "information": {"issueDescription": "Potholes on Ring Rd", "category": "Road Infrastructure"},
        "location": {"locality": "Ward 2"}
    },
    {
        "id": "sub-3",
        "information": {"issueDescription": "Streetlight broken", "category": "Electricity"},
        "location": {"locality": "Ward 1"}
    }
]

MOCK_INTELLIGENCE = [
    {
        "submissionId": "sub-1",
        "primaryCategory": "Water Supply",
        "priorityScore": 75,
        "priorityLevel": "HIGH",
        "isHotspot": True,
        "recommendedAction": "Fix water pipes",
        "recommendedDepartment": "Water Dept",
        "urgency": "High",
        "recommendationReason": "High leakage rate",
        "generatedAt": "2026-07-07T12:00:00Z"
    },
    {
        "submissionId": "sub-2",
        "primaryCategory": "Road Infrastructure",
        "priorityScore": 95,
        "priorityLevel": "CRITICAL",
        "isHotspot": False,
        "recommendedAction": "Repair highway",
        "recommendedDepartment": "PWD",
        "urgency": "Immediate",
        "recommendationReason": "Highway hazards",
        "generatedAt": "2026-07-07T13:00:00Z"
    }
]

MOCK_ANALYSIS = [
    {
        "submissionId": "sub-1",
        "category": "Water Supply",
        "reviewRequired": True,
        "confidence": 0.70,
        "processedAt": "2026-07-07T12:00:00Z"
    },
    {
        "submissionId": "sub-2",
        "category": "Road Infrastructure",
        "reviewRequired": False,
        "confidence": 0.95,
        "processedAt": "2026-07-07T13:00:00Z"
    }
]


class MockDashboardRepository(BaseDashboardRepository):
    def __init__(self, empty=False) -> None:
        self.empty = empty

    async def get_all_submissions(self):
        return [] if self.empty else MOCK_SUBMISSIONS

    async def get_all_intelligence(self):
        return [] if self.empty else MOCK_INTELLIGENCE

    async def get_all_analysis(self):
        return [] if self.empty else MOCK_ANALYSIS

    async def batch_get_submissions(self, ids: list[str]):
        if self.empty:
            return {}
        return {s["id"]: s for s in MOCK_SUBMISSIONS if s["id"] in ids}

    async def batch_get_analysis(self, ids: list[str]):
        if self.empty:
            return {}
        return {a["submissionId"]: a for a in MOCK_ANALYSIS if a["submissionId"] in ids}

    async def batch_get_intelligence(self, ids: list[str]):
        if self.empty:
            return {}
        return {i["submissionId"]: i for i in MOCK_INTELLIGENCE if i["submissionId"] in ids}


# ── Unit Tests ────────────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_summary_calculation():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    summary = await service.get_summary()

    assert summary.totalSubmissions == 3
    assert summary.highPriorityCount == 1
    assert summary.criticalPriorityCount == 1
    assert summary.hotspotsCount == 1
    assert summary.pendingReviewCount == 1


@pytest.mark.anyio
async def test_empty_summary():
    repo = MockDashboardRepository(empty=True)
    service = DashboardService(repo)
    summary = await service.get_summary()

    assert summary.totalSubmissions == 0
    assert summary.highPriorityCount == 0
    assert summary.criticalPriorityCount == 0
    assert summary.hotspotsCount == 0
    assert summary.pendingReviewCount == 0


@pytest.mark.anyio
async def test_priorities_sorting():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    priorities = await service.get_priorities()

    # Should be sorted by score DESC (95 then 75)
    assert len(priorities) == 2
    assert priorities[0].submissionId == "sub-2"
    assert priorities[0].priorityScore == 95
    assert priorities[1].submissionId == "sub-1"
    assert priorities[1].priorityScore == 75


@pytest.mark.anyio
async def test_hotspots_count_and_threshold():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    hotspots = await service.get_hotspots()

    # Submissions grouped by locality and category
    # Ward 1, Water Supply: 1
    # Ward 2, Road Infrastructure: 1
    # Ward 1, Electricity: 1
    assert len(hotspots) == 3
    # Default HOTSPOT_THRESHOLD is 5, so none should be marked as hotspot
    assert any(h.isHotspot for h in hotspots) is False

    # Mock HOTSPOT_THRESHOLD=1 to trigger hotspot flagging
    with patch("app.services.dashboard_service.settings") as mock_settings:
        mock_settings.HOTSPOT_THRESHOLD = 1
        hotspots_flagged = await service.get_hotspots()
        assert all(h.isHotspot for h in hotspots_flagged) is True


@pytest.mark.anyio
async def test_recommendations_urgency_ordering():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    recs = await service.get_recommendations()

    assert len(recs) == 2
    # Should be sorted: Immediate (sub-2) then High (sub-1)
    assert recs[0].submissionId == "sub-2"
    assert recs[0].urgency == "Immediate"
    assert recs[1].submissionId == "sub-1"
    assert recs[1].urgency == "High"


@pytest.mark.anyio
async def test_review_queue_filtering():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    queue = await service.get_review_queue()

    assert len(queue) == 1
    assert queue[0].submissionId == "sub-1"
    assert queue[0].confidence == 0.70


@pytest.mark.anyio
async def test_explorer_details_join():
    repo = MockDashboardRepository()
    service = DashboardService(repo)
    explorer = await service.get_submission_explorer("sub-1")

    assert explorer.submission["id"] == "sub-1"
    assert explorer.analysis["category"] == "Water Supply"
    assert explorer.intelligence["priorityScore"] == 75


@pytest.mark.anyio
async def test_explorer_missing_submission():
    repo = MockDashboardRepository(empty=True)
    service = DashboardService(repo)
    with pytest.raises(ValueError, match="not found"):
        await service.get_submission_explorer("sub-nonexistent")


# ── REST API Integration Tests ────────────────────────────────────────────────

def test_api_summary_endpoint():
    repo = MockDashboardRepository()
    app.dependency_overrides[get_dashboard_service] = lambda: DashboardService(repo)

    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["success"] is True
    assert body["data"]["totalSubmissions"] == 3

    app.dependency_overrides.clear()


def test_api_priorities_endpoint():
    repo = MockDashboardRepository()
    app.dependency_overrides[get_dashboard_service] = lambda: DashboardService(repo)

    response = client.get("/api/v1/dashboard/priorities")
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert len(body["data"]) == 2
    assert body["data"][0]["priorityScore"] == 95

    app.dependency_overrides.clear()


def test_api_explorer_404_handling():
    repo = MockDashboardRepository(empty=True)
    app.dependency_overrides[get_dashboard_service] = lambda: DashboardService(repo)

    response = client.get("/api/v1/dashboard/submissions/missing-id")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    body = response.json()
    assert body["success"] is False
    assert "not found" in body["error"]["message"]

    app.dependency_overrides.clear()
