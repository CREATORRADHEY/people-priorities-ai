"""
test_recommendations.py — IE-6 Recommendation Engine Unit Tests
"""
from app.ai.intelligence.recommendations.recommendation_engine import generate_recommendation


def test_generate_recommendation_standard():
    res = generate_recommendation(
        category="Road Infrastructure",
        priority_level="HIGH",
        is_hotspot=False,
        is_duplicate=False,
        locality="Ward 12",
    )
    assert res["department"] == "Public Works Department (PWD)"
    assert "Ward 12" in res["action"]
    assert "Ward 12" in res["reason"]
    assert res["urgency"] == "High"


def test_generate_recommendation_hotspot_modifier():
    res = generate_recommendation(
        category="Electricity",
        priority_level="CRITICAL",
        is_hotspot=True,
        is_duplicate=False,
        locality="Ward 12",
    )
    assert res["urgency"] == "Immediate"
    assert res["action"].startswith("[HOTSPOT ZONE CLUSTER]")
    assert "High-frequency hotspot:" in res["reason"]


def test_generate_recommendation_duplicate_modifier():
    res = generate_recommendation(
        category="Sanitation",
        priority_level="LOW",
        is_hotspot=False,
        is_duplicate=True,
        locality="Ward 12",
    )
    assert res["urgency"] == "Low"
    assert res["action"].startswith("[DUPLICATE SUBMISSION]")
    assert "Duplicate ticket:" in res["reason"]


def test_generate_recommendation_fallback_category():
    res = generate_recommendation(
        category="Unrecognized Category Name",
        priority_level="MEDIUM",
        is_hotspot=False,
        is_duplicate=False,
        locality="Ward 12",
    )
    assert res["department"] == "District Collectorate"
    assert res["urgency"] == "Standard"
