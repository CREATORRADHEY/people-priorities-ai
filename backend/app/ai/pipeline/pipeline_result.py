"""
pipeline_result.py

Typed result returned by the AnalysisPipeline after a run.

Wraps either a successful AnalysisResult or a structured error, so
callers never need to inspect exceptions to understand pipeline outcomes.
"""
from dataclasses import dataclass, field

from app.ai.models.analysis import AnalysisResult


@dataclass
class PipelineResult:
    """
    Outcome of a single pipeline execution.

    Attributes:
        success:        True if the pipeline reached COMPLETED state.
        analysis:       The persisted AnalysisResult. None on failure.
        analysis_id:    Firestore document ID of the stored analysis.
        pipeline_state: Final state string at the time of return.
        error_message:  Human-readable failure reason. None on success.
        state_history:  Full ordered list of state transitions recorded.
    """
    success: bool
    analysis: AnalysisResult | None = None
    analysis_id: str | None = None
    pipeline_state: str = "RECEIVED"
    error_message: str | None = None
    state_history: list = field(default_factory=list)
