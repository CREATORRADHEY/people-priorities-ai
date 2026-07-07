"""
hotspot_detector.py — IE-4 Hotspot Detection

Counts recent analysis documents matching the same category and locality.
If the count meets or exceeds settings.HOTSPOT_THRESHOLD, the submission
is flagged as a hotspot.

The detector receives a pre-fetched list of candidate documents so it is
completely storage-agnostic and fully testable without Firestore.

Thresholds and look-back windows are read from settings (config.py),
not hardcoded.
"""
from app.ai.intelligence.hotspots.geo_utils import localities_match
from app.core.config import settings
from app.core.logging import logger


def detect_hotspot(
    category: str,
    locality: str,
    candidates: list[dict],
) -> dict:
    """
    Count matching recent issues and determine hotspot status.

    Args:
        category:   Primary category of the current submission.
        locality:   Locality string of the current submission.
        candidates: Recent analysis documents from Firestore, each with
                    keys: category, locality (or location dict).

    Returns:
        dict with keys:
          is_hotspot  (bool)
          issue_count (int)
    """
    threshold = settings.HOTSPOT_THRESHOLD
    count = _count_matching(category, locality, candidates)

    is_hot = count >= threshold
    if is_hot:
        logger.info(
            f"[IE-4] Hotspot detected: category='{category}', "
            f"locality='{locality}', count={count}, threshold={threshold}"
        )

    return {"is_hotspot": is_hot, "issue_count": count}


# ── Private helpers ───────────────────────────────────────────────────────────

def _count_matching(category: str, locality: str, candidates: list[dict]) -> int:
    """Count candidates matching both category and locality."""
    count = 0
    for doc in candidates:
        doc_category = doc.get("category", "")
        doc_locality = _extract_doc_locality(doc)
        if (
            doc_category.lower().strip() == category.lower().strip()
            and localities_match(locality, doc_locality)
        ):
            count += 1
    return count


def _extract_doc_locality(doc: dict) -> str:
    """Extract locality from a Firestore analysis document."""
    loc = doc.get("location")
    if isinstance(loc, dict):
        val = loc.get("locality") or loc.get("ward") or loc.get("district")
        if val:
            return val
    return doc.get("locality") or doc.get("ward") or doc.get("district") or ""

