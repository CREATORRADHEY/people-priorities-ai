"""
rule_engine.py — IE-5 Independent Scoring Rules

Each scoring component is an independent rule function. The Priority Engine
calls them in sequence and combines the results using weights from policy.py.

Adding a new scoring signal = adding one function here + wiring it in
priority_engine.py. Nothing else changes.

All functions return a float in [0.0, 100.0].
"""
from app.ai.intelligence.scoring.policy import (
    CATEGORY_SEVERITY,
    DEFAULT_SEVERITY,
    HOTSPOT_SCORE,
    NON_HOTSPOT_SCORE,
    FREQUENCY_CAP,
)


def severity_rule(category: str) -> float:
    """
    Return a severity score for a given category.

    Reads directly from CATEGORY_SEVERITY in policy.py.
    Returns DEFAULT_SEVERITY when the category is not in the table.
    """
    return float(CATEGORY_SEVERITY.get(category, DEFAULT_SEVERITY))


def frequency_rule(issue_count: int) -> float:
    """
    Convert an issue count to a [0.0, 100.0] frequency score.

    Normalises against FREQUENCY_CAP so repeated high-volume issues
    do not skew the score unboundedly.
    """
    if issue_count <= 0:
        return 0.0
    return min(100.0, (issue_count / FREQUENCY_CAP) * 100.0)


def hotspot_rule(is_hotspot: bool) -> float:
    """Return HOTSPOT_SCORE if the submission is a hotspot, else 0."""
    return float(HOTSPOT_SCORE if is_hotspot else NON_HOTSPOT_SCORE)


def location_rule(location_weight: int) -> float:
    """
    Return the location score.

    location_weight is already [0–100], provided by location_weights.py.
    This rule passes it through directly but is isolated so future
    modifiers (e.g. decay by distance from district headquarters) can be
    added without changing the engine.
    """
    return float(max(0, min(100, location_weight)))


def confidence_rule(ai_confidence: float) -> float:
    """
    Convert a Gemini confidence float [0.0–1.0] to [0.0–100.0].
    """
    return round(max(0.0, min(1.0, ai_confidence)) * 100.0, 2)
