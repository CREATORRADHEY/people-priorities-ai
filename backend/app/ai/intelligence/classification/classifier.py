"""
classifier.py — IE-1 Classification Engine

Validates and normalises the category output from the FP-3.1 Gemini analysis
against the canonical government taxonomy.

Responsibilities:
  - Accept Gemini's category and themes as input
  - Validate against CANONICAL_CATEGORIES (exact match first)
  - Fall back to alias lookup if not found
  - Apply confidence penalty when normalisation was required
  - Infer a secondary category using SECONDARY_CATEGORY_MAP
"""
from app.ai.intelligence.classification.rules import (
    CANONICAL_CATEGORIES,
    CATEGORY_ALIASES,
    SECONDARY_CATEGORY_MAP,
    NORMALISATION_CONFIDENCE_PENALTY,
)
from app.core.logging import logger


def classify(
    ai_category: str,
    ai_themes: list[str],
    ai_confidence: float,
) -> dict:
    """
    Classify a submission using the canonical category taxonomy.

    Args:
        ai_category:  Category string returned by Gemini Stage 2.
        ai_themes:    Themes list returned by Gemini Stage 2.
        ai_confidence: Gemini confidence score (0.0–1.0).

    Returns:
        dict with keys:
          primary_category    (str)
          secondary_category  (str | None)
          category_confidence (float)
          was_normalised      (bool)
    """
    primary, was_normalised = _resolve_category(ai_category)

    # Adjust confidence when alias normalisation was needed
    category_confidence = ai_confidence
    if was_normalised:
        category_confidence = max(0.0, ai_confidence - NORMALISATION_CONFIDENCE_PENALTY)
        logger.info(
            f"[IE-1] Category '{ai_category}' normalised → '{primary}'. "
            f"Confidence adjusted: {ai_confidence:.2f} → {category_confidence:.2f}"
        )

    secondary = _infer_secondary(primary, ai_themes)

    return {
        "primary_category": primary,
        "secondary_category": secondary,
        "category_confidence": round(category_confidence, 4),
        "was_normalised": was_normalised,
    }


# ── Private helpers ───────────────────────────────────────────────────────────

def _resolve_category(category: str) -> tuple[str, bool]:
    """
    Resolve a category string to a canonical taxonomy entry.

    Returns (canonical_category, was_normalised).
    """
    # Exact match (case-sensitive)
    if category in CANONICAL_CATEGORIES:
        return category, False

    # Case-insensitive exact match
    lower = category.lower().strip()
    for canonical in CANONICAL_CATEGORIES:
        if canonical.lower() == lower:
            return canonical, True

    # Alias lookup
    if lower in CATEGORY_ALIASES:
        return CATEGORY_ALIASES[lower], True

    # Partial word match against alias keys
    for alias_key, canonical in CATEGORY_ALIASES.items():
        if alias_key in lower:
            return canonical, True

    # Fallback — keep original but flag as normalised (penalty applied)
    logger.warning(
        f"[IE-1] Category '{category}' could not be mapped to taxonomy. "
        f"Defaulting to 'Other'."
    )
    return "Other", True


def _infer_secondary(primary: str, themes: list[str]) -> str | None:
    """
    Infer a secondary category using the primary category and theme signals.

    Checks SECONDARY_CATEGORY_MAP first, then scans themes for category hints.
    """
    # Direct map lookup
    secondary = SECONDARY_CATEGORY_MAP.get(primary)

    # Theme-based override — check if any theme strongly signals another category
    themes_lower = " ".join(themes).lower()
    for alias_key, canonical in CATEGORY_ALIASES.items():
        if (
            alias_key in themes_lower
            and canonical != primary
            and canonical != secondary
        ):
            secondary = canonical
            break

    return secondary if secondary != primary else None
