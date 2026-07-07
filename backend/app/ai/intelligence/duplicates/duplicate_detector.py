"""
duplicate_detector.py — IE-3 Duplicate Detection

Queries recent Firestore analysis documents and uses the heuristic
similarity scorer to identify potential duplicate submissions.

The detector is intentionally storage-agnostic: it receives a list of
candidate documents as a plain Python list. Fetching those candidates from
Firestore is the pipeline's responsibility so this module is fully testable
without a real database.
"""
from app.ai.intelligence.duplicates.similarity import compute_similarity, is_duplicate
from app.core.logging import logger


def detect_duplicate(
    category: str,
    locality: str,
    summary: str,
    candidates: list[dict],
) -> dict:
    """
    Find the most similar candidate in a list of recent analysis documents.

    Args:
        category:   Primary category of the current submission.
        locality:   Locality string of the current submission.
        summary:    Normalized English summary of the current submission.
        candidates: List of recent analysis dicts from Firestore, each with
                    keys: analysisId, category, locality, summary.

    Returns:
        dict with keys:
          is_duplicate    (bool)
          duplicate_of    (str | None)   analysisId of the best match
          similarity_score (float | None)
    """
    if not candidates:
        return {"is_duplicate": False, "duplicate_of": None, "similarity_score": None}

    best_score: float = 0.0
    best_id: str | None = None

    for doc in candidates:
        cand_category = doc.get("category", "")
        cand_locality = _extract_locality(doc)
        cand_summary = doc.get("summary", "")
        cand_id = doc.get("analysisId") or doc.get("id", "")

        score = compute_similarity(
            category, locality, summary,
            cand_category, cand_locality, cand_summary,
        )

        if score > best_score:
            best_score = score
            best_id = cand_id

    found = is_duplicate(best_score)
    if found:
        logger.info(
            f"[IE-3] Duplicate detected: similarity={best_score:.2f}, "
            f"matching analysisId={best_id}"
        )

    return {
        "is_duplicate": found,
        "duplicate_of": best_id if found else None,
        "similarity_score": round(best_score, 4) if best_score > 0 else None,
    }


# ── Private helpers ───────────────────────────────────────────────────────────

def _extract_locality(doc: dict) -> str:
    """Extract the best locality string from a Firestore analysis document."""
    loc = doc.get("location")
    if isinstance(loc, dict):
        val = loc.get("locality") or loc.get("ward") or loc.get("district")
        if val:
            return val
    return doc.get("locality") or doc.get("ward") or doc.get("district") or ""

