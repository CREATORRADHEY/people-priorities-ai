"""
test_duplicates.py — IE-3 Duplicate Detection Unit Tests
"""
from app.ai.intelligence.duplicates.similarity import compute_similarity, is_duplicate
from app.ai.intelligence.duplicates.duplicate_detector import detect_duplicate


def test_similarity_calculation_identical():
    # Identical category, locality, and summary words
    score = compute_similarity(
        "Water Supply", "Ward 12", "Water supply interrupted for three days",
        "Water Supply", "Ward 12", "Tap water is not coming since three days",
    )
    # Cat = 1.0 (0.4), Loc = 1.0 (0.4), Text = 0.6+ Jaccard (0.2)
    assert score >= 0.85
    assert is_duplicate(score) is True


def test_similarity_calculation_different_category():
    score = compute_similarity(
        "Water Supply", "Ward 12", "Water supply is not working",
        "Electricity", "Ward 12", "Power cuts are frequent",
    )
    # Cat = 0.0 (0.0), Loc = 1.0 (0.4), Text = low overlap
    assert score < 0.60
    assert is_duplicate(score) is False


def test_similarity_calculation_different_locality():
    score = compute_similarity(
        "Water Supply", "Ward 12", "Water supply is not working",
        "Water Supply", "Ward 5", "Water supply is down",
    )
    # Cat = 1.0 (0.4), Loc = 0.0 (0.0), Text = high overlap (0.2)
    assert score < 0.70
    assert is_duplicate(score) is False


def test_detect_duplicate_empty_candidates():
    res = detect_duplicate("Water Supply", "Ward 12", "Summary text", [])
    assert res["is_duplicate"] is False
    assert res["duplicate_of"] is None


def test_detect_duplicate_matches():
    candidates = [
        {
            "analysisId": "anal-1",
            "category": "Water Supply",
            "locality": "Ward 12",
            "summary": "Pipes are dry since three days.",
        },
        {
            "analysisId": "anal-2",
            "category": "Electricity",
            "locality": "Ward 12",
            "summary": "Power supply down.",
        }
    ]
    res = detect_duplicate(
        category="Water Supply",
        locality="Ward 12",
        summary="Water supply interrupted for three days in the locality.",
        candidates=candidates
    )
    assert res["is_duplicate"] is True
    assert res["duplicate_of"] == "anal-1"
    assert res["similarity_score"] is not None
    assert res["similarity_score"] >= 0.75
