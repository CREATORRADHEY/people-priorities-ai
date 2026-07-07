"""
dependencies/intelligence.py

FastAPI dependencies for the Intelligence Engine.
"""
from fastapi import Depends

from app.ai.intelligence.pipeline.intelligence_pipeline import IntelligencePipeline
from app.ai.intelligence.repositories.base_intelligence_repository import BaseIntelligenceRepository
from app.ai.intelligence.repositories.intelligence_repository import FirestoreIntelligenceRepository


def get_intelligence_repository() -> BaseIntelligenceRepository:
    """Return the active intelligence repository implementation."""
    return FirestoreIntelligenceRepository()


def get_intelligence_pipeline(
    repository: BaseIntelligenceRepository = Depends(get_intelligence_repository),
) -> IntelligencePipeline:
    """Return an IntelligencePipeline with the repository injected."""
    return IntelligencePipeline(repository=repository)
