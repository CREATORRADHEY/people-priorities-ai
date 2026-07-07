"""
dependencies/dashboard.py

FastAPI dependency providers for the MP dashboard.
"""
from fastapi import Depends

from app.repositories.dashboard_repository import BaseDashboardRepository, FirestoreDashboardRepository
from app.services.dashboard_service import DashboardService


def get_dashboard_repository() -> BaseDashboardRepository:
    """Return the active dashboard repository implementation."""
    return FirestoreDashboardRepository()


def get_dashboard_service(
    repo: BaseDashboardRepository = Depends(get_dashboard_repository),
) -> DashboardService:
    """Return a DashboardService with repository injected."""
    return DashboardService(repo)
