"""
Analysis domain models: PipelineContext and AnalysisResult.

PipelineContext flows through all pipeline stages, accumulating outputs.
AnalysisResult is the final persisted document written to Firestore analysis/.
"""
from pydantic import BaseModel, Field
from typing import Any


# ──────────────────────────────────────────────────────────────────────────────
# Pipeline Context
# ──────────────────────────────────────────────────────────────────────────────

class PipelineContext(BaseModel):
    """
    Mutable context object that flows through every pipeline stage.

    Instead of passing raw dicts between stages the pipeline carries a single
    typed object. Each stage reads what it needs and writes its outputs back.
    The context is never persisted directly; it is transformed into
    an AnalysisResult at the end of the pipeline.
    """
    # Submission identity
    request_id: str
    submission_id: str
    submission_data: dict = Field(default_factory=dict)

    # Stage 1 (Normalize) outputs
    language: str | None = None
    translated_text: str | None = None
    summary: str | None = None

    # Stage 2 (Reason) outputs
    category: str | None = None
    themes: list[str] = Field(default_factory=list)
    confidence: float | None = None
    recommendation: str | None = None
    reasoning: str | None = None

    # Pipeline tracking
    pipeline_state: str = "RECEIVED"
    state_history: list[dict[str, Any]] = Field(default_factory=list)

    # Observability — accumulated across both stages
    total_latency_ms: float = 0.0
    stage1_metrics: dict = Field(default_factory=dict)
    stage2_metrics: dict = Field(default_factory=dict)

    def transition(self, new_state: str, detail: str | None = None) -> None:
        """
        Record a state transition and update current state.
        Every transition is appended to state_history for full audit trail.
        """
        import datetime
        self.state_history.append({
            "from": self.pipeline_state,
            "to": new_state,
            "at": datetime.datetime.now(datetime.UTC).isoformat(),
            "detail": detail,
        })
        self.pipeline_state = new_state


# ──────────────────────────────────────────────────────────────────────────────
# Analysis Result (Persisted to Firestore)
# ──────────────────────────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    """
    Final analysis document persisted to Firestore analysis/ collection.

    Extends the AAD-01 Section 11 schema with versioning fields required
    by the tech lead review:
      - processingVersion: pipeline code version
      - pipelineVersion:   orchestrator schema version
      - promptVersion:     active prompt set version from manifest.json
    """
    # Identity
    submissionId: str
    analysisId: str | None = None

    # Stage 1 outputs
    language: str
    translatedText: str | None = None
    summary: str

    # Stage 2 outputs
    category: str
    themes: list[str]
    confidence: float
    recommendation: str
    reasoning: str

    # Human Review Layer (AAD-01 Section 17 / tech lead recommendation)
    reviewRequired: bool

    # Pipeline tracking
    pipelineState: str
    stateHistory: list[dict] = Field(default_factory=list)

    # Versioning
    processingVersion: str = "1.0.0"
    pipelineVersion: str = "1.0"
    promptVersion: str

    # Observability
    model: str
    totalLatencyMs: float
    stage1Metrics: dict = Field(default_factory=dict)
    stage2Metrics: dict = Field(default_factory=dict)

    # Timestamps
    processedAt: str
