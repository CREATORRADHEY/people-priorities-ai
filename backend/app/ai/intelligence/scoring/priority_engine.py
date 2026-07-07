"""
priority_engine.py — IE-5 Priority Engine

Orchestrates the independent scoring rules from rule_engine.py and produces:
  - priorityScore  (int, 0–100)
  - priorityLevel  (str: LOW / MEDIUM / HIGH / CRITICAL)

Formula:
  score = (
      WEIGHT_SEVERITY   × severity_rule(category)
    + WEIGHT_FREQUENCY  × frequency_rule(issue_count)
    + WEIGHT_HOTSPOT    × hotspot_rule(is_hotspot)
    + WEIGHT_LOCATION   × location_rule(location_weight)
    + WEIGHT_CONFIDENCE × confidence_rule(ai_confidence)
  )

All computation is deterministic and Gemini-free — fully explainable.
"""
from app.ai.intelligence.scoring.location_weights import get_location_weight
from app.ai.intelligence.scoring.policy import (
    WEIGHT_SEVERITY,
    WEIGHT_FREQUENCY,
    WEIGHT_HOTSPOT,
    WEIGHT_LOCATION,
    WEIGHT_CONFIDENCE,
    PRIORITY_LEVELS,
)
from app.ai.intelligence.scoring.rule_engine import (
    severity_rule,
    frequency_rule,
    hotspot_rule,
    location_rule,
    confidence_rule,
)
from app.core.logging import logger


def compute_priority(
    category: str,
    issue_count: int,
    is_hotspot: bool,
    locality: str,
    ai_confidence: float,
) -> dict:
    """
    Compute the priority score and level for a submission.

    Args:
        category:      Primary category (after IE-1 normalisation).
        issue_count:   Number of similar recent issues (from IE-4).
        is_hotspot:    Whether the submission is a hotspot (from IE-4).
        locality:      Locality string for weight lookup.
        ai_confidence: Gemini confidence score [0.0, 1.0].

    Returns:
        dict with keys:
          priority_score (int 0–100)
          priority_level (str)
          score_breakdown (dict)   — for audit/observability
    """
    sev = severity_rule(category)
    freq = frequency_rule(issue_count)
    hot = hotspot_rule(is_hotspot)
    loc_weight = get_location_weight(locality)
    loc = location_rule(loc_weight)
    conf = confidence_rule(ai_confidence)

    raw_score = (
        WEIGHT_SEVERITY * sev
        + WEIGHT_FREQUENCY * freq
        + WEIGHT_HOTSPOT * hot
        + WEIGHT_LOCATION * loc
        + WEIGHT_CONFIDENCE * conf
    )
    score = max(0, min(100, round(raw_score)))
    level = _score_to_level(score)

    logger.info(
        f"[IE-5] Priority computed: score={score}, level={level}, "
        f"sev={sev:.0f}, freq={freq:.0f}, hot={hot:.0f}, "
        f"loc={loc:.0f}, conf={conf:.0f}"
    )

    return {
        "priority_score": score,
        "priority_level": level,
        "score_breakdown": {
            "severity": round(sev, 2),
            "frequency": round(freq, 2),
            "hotspot": round(hot, 2),
            "location": round(loc, 2),
            "confidence": round(conf, 2),
        },
    }


# ── Private helpers ───────────────────────────────────────────────────────────

def _score_to_level(score: int) -> str:
    """Map a numeric score to a named priority level using PRIORITY_LEVELS."""
    for threshold, level in PRIORITY_LEVELS:
        if score >= threshold:
            return level
    return "LOW"
