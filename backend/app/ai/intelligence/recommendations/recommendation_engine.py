"""
recommendation_engine.py — IE-6 Recommendation Engine

Generates structured recommendations based on category, priority, and location.
Runs entirely deterministically to ensure auditable, consistent suggestions.
"""
from app.ai.intelligence.recommendations.templates import (
    RECOMMENDATION_TEMPLATES,
    DEFAULT_DEPARTMENT,
    DEFAULT_ACTION,
    DEFAULT_REASON,
)
from app.core.logging import logger


def generate_recommendation(
    category: str,
    priority_level: str,
    is_hotspot: bool,
    is_duplicate: bool,
    locality: str,
) -> dict:
    """
    Generate a structured recommendation.

    Args:
        category:       Primary category (after IE-1 resolving).
        priority_level: CRITICAL / HIGH / MEDIUM / LOW (from IE-5).
        is_hotspot:     Whether location is a hotspot for this category (from IE-4).
        is_duplicate:   Whether it is a duplicate submission (from IE-3).
        locality:       Target location name for variable injection.

    Returns:
        dict with keys:
          action      (str)
          department  (str)
          urgency     (str)
          reason      (str)
    """
    # 1. Resolve Urgency directly from Priority Level
    urgency = _determine_urgency(priority_level)

    # 2. Get template group for category
    tmpl = RECOMMENDATION_TEMPLATES.get(category)
    if not tmpl:
        logger.warning(f"[IE-6] No recommendation template found for category '{category}'")
        action = DEFAULT_ACTION
        dept = DEFAULT_DEPARTMENT
        reason = DEFAULT_REASON
    else:
        dept = tmpl["department"]
        # Inject locality safely
        loc_name = locality or "the district"
        action = tmpl["action_template"].format(locality=loc_name)
        reason = tmpl["reason_template"].format(locality=loc_name)

    # 3. Apply Modifiers based on Hotspot and Duplicate status
    if is_duplicate:
        # If it's a duplicate, lower priority of this specific ticket or reference the original
        action = f"[DUPLICATE SUBMISSION] Reference matching open ticket. {action}"
        reason = f"Duplicate ticket: {reason}"

    if is_hotspot:
        # Hotspot adds regional severity modifier
        action = f"[HOTSPOT ZONE CLUSTER] Priority investigation requested. {action}"
        reason = f"High-frequency hotspot: {reason}"

    return {
        "action": action,
        "department": dept,
        "urgency": urgency,
        "reason": reason,
    }


def _determine_urgency(priority_level: str) -> str:
    """Map Priority Level directly to a standard Urgency string."""
    level = priority_level.upper()
    if level == "CRITICAL":
        return "Immediate"
    elif level == "HIGH":
        return "High"
    elif level == "MEDIUM":
        return "Standard"
    else:
        return "Low"
