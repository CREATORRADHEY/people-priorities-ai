"""
dashboard.py — Pydantic response schemas for the Decision Intelligence Portal.
"""
from pydantic import BaseModel, Field
from typing import Any


class DashboardSummary(BaseModel):
    """
    Summary counts for the executive overview widget.
    """
    totalSubmissions: int
    highPriorityCount: int
    criticalPriorityCount: int
    hotspotsCount: int
    pendingReviewCount: int


class PriorityItem(BaseModel):
    """
    Item within the Priority Queue widget.
    """
    submissionId: str
    title: str
    locality: str
    category: str
    priorityScore: int
    priorityLevel: str
    recommendedAction: str
    processedAt: str


class HotspotItem(BaseModel):
    """
    Item representing a ward/locality with concentrated reports.
    """
    locality: str
    issueCount: int
    topCategory: str
    isHotspot: bool


class RecommendationItem(BaseModel):
    """
    Item representing active administrative actions.
    """
    submissionId: str
    primaryCategory: str
    priorityLevel: str
    recommendedAction: str
    recommendedDepartment: str
    urgency: str
    reason: str


class ReviewItem(BaseModel):
    """
    Item representing an issue awaiting manual staff verification.
    """
    submissionId: str
    title: str
    locality: str
    category: str
    confidence: float
    processedAt: str


class SubmissionExplorerResponse(BaseModel):
    """
    Detailed explainability payload for the Submission Explorer drawer.
    Includes raw submission, AI Gateway analysis, and deterministic intelligence results.
    """
    submission: dict[str, Any]
    analysis: dict[str, Any] | None = None
    intelligence: dict[str, Any] | None = None
