"""
intelligence.py

Domain models for the FP-3.2 Intelligence Engine.

IntelligenceContext:
    Flows through all six IE clusters (IE-1 → IE-6) accumulating outputs.
    Never persisted directly — converted to IntelligenceResult at completion.

IntelligenceResult:
    Final persisted document written to Firestore intelligence/ collection.
"""
import datetime
from typing import Any
from pydantic import BaseModel, Field


# ──────────────────────────────────────────────────────────────────────────────
# Intelligence Context  (pipeline-internal)
# ──────────────────────────────────────────────────────────────────────────────

class IntelligenceContext(BaseModel):
    """
    Shared context object passed through every IE cluster.

    Each cluster reads the fields it needs and writes its outputs back.
    The context is the single source of truth while the pipeline is running.
    """

    # Identity
    request_id: str
    submission_id: str
    analysis_id: str

    # Raw AnalysisResult fields consumed by the clusters
    ai_category: str
    ai_themes: list[str] = Field(default_factory=list)
    ai_confidence: float
    ai_summary: str
    location: dict = Field(default_factory=dict)   # raw location dict from submission

    # IE-1: Classification
    primary_category: str = ""
    secondary_category: str | None = None
    category_confidence: float = 0.0

    # IE-2: Theme Normalization
    normalized_themes: list[str] = Field(default_factory=list)

    # IE-3: Duplicate Detection
    is_duplicate: bool = False
    duplicate_of: str | None = None
    similarity_score: float | None = None

    # IE-4: Hotspot Detection
    is_hotspot: bool = False
    issue_count: int = 0

    # IE-5: Priority Engine
    priority_score: int = 0
    priority_level: str = "LOW"

    # IE-6: Recommendation Engine
    recommended_action: str = ""
    recommended_department: str = ""
    urgency: str = ""
    recommendation_reason: str = ""

    # Pipeline tracking
    ie_state: str = "ANALYZED"
    state_history: list[dict[str, Any]] = Field(default_factory=list)

    def transition(self, new_state: str, detail: str | None = None) -> None:
        """Record a state transition — every transition is persisted."""
        self.state_history.append({
            "from": self.ie_state,
            "to": new_state,
            "at": datetime.datetime.now(datetime.UTC).isoformat(),
            "detail": detail,
        })
        self.ie_state = new_state

    def locality(self) -> str:
        """Return the best available locality string from the location dict."""
        return (
            self.location.get("locality")
            or self.location.get("ward")
            or self.location.get("district")
            or ""
        )


# ──────────────────────────────────────────────────────────────────────────────
# Intelligence Result  (persisted to Firestore intelligence/)
# ──────────────────────────────────────────────────────────────────────────────

class IntelligenceResult(BaseModel):
    """
    Final intelligence document stored in Firestore intelligence/ collection.

    Keeps analysis/ and intelligence/ collections separate per the FP-3.2 spec.
    """
    # Identity
    submissionId: str
    analysisId: str
    intelligenceId: str | None = None

    # IE-1
    primaryCategory: str
    secondaryCategory: str | None
    categoryConfidence: float

    # IE-2
    normalizedThemes: list[str]

    # IE-3
    isDuplicate: bool
    duplicateOf: str | None
    similarityScore: float | None

    # IE-4
    isHotspot: bool
    issueCount: int

    # IE-5
    priorityScore: int
    priorityLevel: str          # LOW / MEDIUM / HIGH / CRITICAL

    # IE-6
    recommendedAction: str
    recommendedDepartment: str
    urgency: str
    recommendationReason: str

    # Pipeline tracking
    ieState: str
    stateHistory: list[dict] = Field(default_factory=list)

    # Versioning
    processingVersion: str = "1.0.0"
    generatedAt: str
