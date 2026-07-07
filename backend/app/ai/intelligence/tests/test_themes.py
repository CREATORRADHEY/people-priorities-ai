"""
test_themes.py — IE-2 Theme Normalization Unit Tests
"""
from app.ai.intelligence.themes.extractor import normalize_themes


def test_normalize_themes_canonical():
    # Canonical theme remains unchanged
    res = normalize_themes(["Street Lighting", "Water Supply"])
    assert res == ["Street Lighting", "Water Supply"]


def test_normalize_themes_aliases():
    # Lowercase aliases map to canonical terms
    res = normalize_themes(["streetlight", "drinking water", "pothole"])
    assert "Street Lighting" in res
    assert "Water Supply" in res
    assert "Pothole Repair" in res


def test_normalize_themes_deduplication():
    # Duplicate resolved terms are deduplicated
    res = normalize_themes(["streetlight", "streetlights", "street light", "Street Lighting"])
    assert res == ["Street Lighting"]


def test_normalize_themes_fallback():
    # Unrecognized terms fallback to Title-Case
    res = normalize_themes(["some custom theme", "another custom issue"])
    assert res == ["Another Custom Issue", "Some Custom Theme"]
