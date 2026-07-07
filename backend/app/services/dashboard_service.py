"""
dashboard_service.py — Service layer orchestrator for the MP Dashboard.

Coordinates business logic, aggregates counts, groups geographical hotspots,
and packages details for the Submission Explorer. Uses batched repository queries
to prevent N+1 query loops.
"""
from app.repositories.dashboard_repository import BaseDashboardRepository
from app.schemas.dashboard import (
    DashboardSummary,
    PriorityItem,
    HotspotItem,
    RecommendationItem,
    ReviewItem,
    SubmissionExplorerResponse,
)
from app.core.config import settings
from app.core.logging import logger


class DashboardService:
    """
    Coordinates dashboard query assembly and business rules.
    """

    def __init__(self, repo: BaseDashboardRepository) -> None:
        self._repo = repo

    async def get_summary(self) -> DashboardSummary:
        """Fetch high-level metrics for the executive overview cards."""
        submissions = await self._repo.get_all_submissions()
        intelligence = await self._repo.get_all_intelligence()
        analysis = await self._repo.get_all_analysis()

        total = len(submissions)
        high = 0
        critical = 0
        hotspots = 0

        for intel in intelligence:
            level = intel.get("priorityLevel", "").upper()
            if level == "CRITICAL":
                critical += 1
            elif level == "HIGH":
                high += 1

            if intel.get("isHotspot"):
                hotspots += 1

        pending_reviews = sum(1 for a in analysis if a.get("reviewRequired"))

        return DashboardSummary(
            totalSubmissions=total,
            highPriorityCount=high,
            criticalPriorityCount=critical,
            hotspotsCount=hotspots,
            pendingReviewCount=pending_reviews,
        )

    async def get_priorities(self) -> list[PriorityItem]:
        """Fetch all priorities sorted by priorityScore DESC, batched to avoid N+1 queries."""
        intelligence_docs = await self._repo.get_all_intelligence()

        # Sort by priorityScore DESC
        sorted_intel = sorted(
            intelligence_docs,
            key=lambda x: x.get("priorityScore", 0),
            reverse=True
        )

        sub_ids = [doc["submissionId"] for doc in sorted_intel if doc.get("submissionId")]

        # Batch load matching submissions
        submissions_map = await self._repo.batch_get_submissions(sub_ids)

        items = []
        for intel in sorted_intel:
            sub_id = intel.get("submissionId")
            sub_data = submissions_map.get(sub_id, {})

            # Extract title (fallback to snippet of issueDescription)
            info = sub_data.get("information", {})
            title = info.get("issueDescription", "")[:80]
            if len(info.get("issueDescription", "")) > 80:
                title += "..."

            # Locality fallback
            loc = sub_data.get("location", {})
            locality = loc.get("locality") or loc.get("ward") or loc.get("district") or "Unknown"

            items.append(
                PriorityItem(
                    submissionId=sub_id,
                    title=title or "Development issue reported.",
                    locality=locality,
                    category=intel.get("primaryCategory") or info.get("category") or "Other",
                    priorityScore=intel.get("priorityScore", 0),
                    priorityLevel=intel.get("priorityLevel", "LOW"),
                    recommendedAction=intel.get("recommendedAction", "Investigate issue."),
                    processedAt=intel.get("generatedAt") or sub_data.get("serverCreatedAt") or "",
                )
            )

        return items

    async def get_hotspots(self) -> list[HotspotItem]:
        """
        Groups all submissions dynamically by locality and category
        to count and identify active hotspots.
        """
        submissions = await self._repo.get_all_submissions()
        analysis_docs = await self._repo.get_all_analysis()

        # Build analysis mapping to look up category for each submission
        analysis_map = {doc["submissionId"]: doc for doc in analysis_docs if doc.get("submissionId")}

        # Group count map: {(locality, category): count}
        group_counts = {}

        for sub in submissions:
            sub_id = sub.get("id")
            analysis = analysis_map.get(sub_id, {})

            # Extract locality
            loc = sub.get("location", {})
            locality = loc.get("locality") or loc.get("ward") or loc.get("district") or "Unknown"

            # Category preference: normalized category from analysis, fallback to raw submission category
            category = analysis.get("category") or sub.get("information", {}).get("category") or "Other"

            key = (locality, category)
            group_counts[key] = group_counts.get(key, 0) + 1

        items = []
        threshold = settings.HOTSPOT_THRESHOLD

        for (locality, category), count in group_counts.items():
            items.append(
                HotspotItem(
                    locality=locality,
                    issueCount=count,
                    topCategory=category,
                    isHotspot=count >= threshold,
                )
            )

        # Sort hotspots by issueCount DESC
        return sorted(items, key=lambda x: x.issueCount, reverse=True)

    async def get_recommendations(self) -> list[RecommendationItem]:
        """Retrieve active recommendations from intelligence documents."""
        intelligence_docs = await self._repo.get_all_intelligence()

        items = []
        for intel in intelligence_docs:
            if intel.get("recommendedAction"):
                items.append(
                    RecommendationItem(
                        submissionId=intel["submissionId"],
                        primaryCategory=intel.get("primaryCategory", "Other"),
                        priorityLevel=intel.get("priorityLevel", "LOW"),
                        recommendedAction=intel["recommendedAction"],
                        recommendedDepartment=intel.get("recommendedDepartment", "General Administration"),
                        urgency=intel.get("urgency", "Standard"),
                        reason=intel.get("recommendationReason", ""),
                    )
                )

        # Sort recommendations by urgency level hierarchy
        urgency_order = {"Immediate": 0, "High": 1, "Standard": 2, "Low": 3}
        return sorted(items, key=lambda x: urgency_order.get(x.urgency, 4))

    async def get_review_queue(self) -> list[ReviewItem]:
        """Fetch all submissions flagged for manual human review, batched."""
        analysis_docs = await self._repo.get_all_analysis()

        # Filter analysis docs needing review
        review_docs = [doc for doc in analysis_docs if doc.get("reviewRequired")]

        sub_ids = [doc["submissionId"] for doc in review_docs if doc.get("submissionId")]

        # Batch get submissions
        submissions_map = await self._repo.batch_get_submissions(sub_ids)

        items = []
        for doc in review_docs:
            sub_id = doc.get("submissionId")
            sub_data = submissions_map.get(sub_id, {})

            # Extract title
            info = sub_data.get("information", {})
            title = info.get("issueDescription", "")[:80]
            if len(info.get("issueDescription", "")) > 80:
                title += "..."

            # Locality
            loc = sub_data.get("location", {})
            locality = loc.get("locality") or loc.get("ward") or loc.get("district") or "Unknown"

            items.append(
                ReviewItem(
                    submissionId=sub_id,
                    title=title or "Civic issue requiring review.",
                    locality=locality,
                    category=doc.get("category") or info.get("category") or "Other",
                    confidence=doc.get("confidence", 0.0),
                    processedAt=doc.get("processedAt") or sub_data.get("serverCreatedAt") or "",
                )
            )

        # Sort by processedAt DESC
        return sorted(items, key=lambda x: x.processedAt, reverse=True)

    async def get_submission_explorer(self, submission_id: str) -> SubmissionExplorerResponse:
        """
        Load all processing stages for a single submission to show full lineage.
        Uses batched retrieval to prevent multiple queries.
        """
        submissions = await self._repo.batch_get_submissions([submission_id])
        analysis = await self._repo.batch_get_analysis([submission_id])
        intelligence = await self._repo.batch_get_intelligence([submission_id])

        sub_data = submissions.get(submission_id)
        if not sub_data:
            # Try parsing direct collections if batch mapping is empty
            from app.repositories.submission_repository import FirestoreSubmissionRepository
            from app.repositories.base_submission_repository import NotFoundException
            try:
                repo = FirestoreSubmissionRepository()
                sub_data = await repo.get_submission(submission_id)
            except Exception:
                sub_data = None

        if not sub_data:
            raise ValueError(f"Submission '{submission_id}' not found.")

        return SubmissionExplorerResponse(
            submission=sub_data,
            analysis=analysis.get(submission_id),
            intelligence=intelligence.get(submission_id),
        )
