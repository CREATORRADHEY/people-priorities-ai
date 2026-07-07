"""
test_hotspots.py — IE-4 Hotspot Detection Unit Tests
"""
from unittest.mock import patch
from app.ai.intelligence.hotspots.geo_utils import normalize_locality, localities_match
from app.ai.intelligence.hotspots.hotspot_detector import detect_hotspot
from app.core.config import settings


def test_locality_normalisation():
    assert normalize_locality("  Ward  12   ") == "ward 12"
    assert normalize_locality("central delhi") == "central delhi"


def test_localities_match():
    assert localities_match("Ward 12", "ward 12") is True
    assert localities_match("Ward 12, Delhi", "Ward 12") is True
    assert localities_match("Ward 12", "Ward 12, Delhi") is True
    assert localities_match("Ward 5", "Ward 12") is False


def test_detect_hotspot_below_threshold():
    # settings.HOTSPOT_THRESHOLD defaults to 5
    candidates = [
        {"category": "Water Supply", "locality": "Ward 12"},
        {"category": "Water Supply", "locality": "Ward 12"},
        {"category": "Water Supply", "locality": "Ward 12"},
    ]
    res = detect_hotspot("Water Supply", "Ward 12", candidates)
    assert res["is_hotspot"] is False
    assert res["issue_count"] == 3


def test_detect_hotspot_at_threshold():
    candidates = [
        {"category": "Water Supply", "locality": "ward 12"},
        {"category": "Water Supply", "locality": "ward 12"},
        {"category": "Water Supply", "locality": "ward 12"},
        {"category": "Water Supply", "locality": "ward 12"},
        {"category": "Water Supply", "locality": "Ward 12, Delhi"},
    ]
    res = detect_hotspot("Water Supply", "Ward 12", candidates)
    assert res["is_hotspot"] is True
    assert res["issue_count"] == 5


def test_detect_hotspot_different_categories():
    # Only category matches should count
    candidates = [
        {"category": "Water Supply", "locality": "Ward 12"},
        {"category": "Water Supply", "locality": "Ward 12"},
        {"category": "Electricity", "locality": "Ward 12"},
        {"category": "Electricity", "locality": "Ward 12"},
        {"category": "Electricity", "locality": "Ward 12"},
    ]
    res = detect_hotspot("Water Supply", "Ward 12", candidates)
    assert res["is_hotspot"] is False
    assert res["issue_count"] == 2
