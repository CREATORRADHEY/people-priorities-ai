"""
dependencies/analysis.py

FastAPI dependency providers for the AI analysis pipeline.

Mirrors the FP-2.2 repository injection pattern:
  - Concrete implementation is created here
  - Injected into routes via Depends()
  - Tests override via dependency_overrides
"""
from fastapi import Depends

from app.ai.pipeline.analysis_pipeline import AnalysisPipeline
from app.ai.repositories.base_analysis_repository import BaseAnalysisRepository
from app.ai.repositories.analysis_repository import FirestoreAnalysisRepository


def get_analysis_repository() -> BaseAnalysisRepository:
    """Return the active analysis repository implementation."""
    return FirestoreAnalysisRepository()


def get_analysis_pipeline(
    repository: BaseAnalysisRepository = Depends(get_analysis_repository),
) -> AnalysisPipeline:
    """Return an AnalysisPipeline with the active gateway and repository injected."""
    return AnalysisPipeline(repository=repository)
