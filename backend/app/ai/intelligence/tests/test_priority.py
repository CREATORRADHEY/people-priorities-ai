"""
test_priority.py — IE-5 Priority Engine Unit Tests
"""
from app.ai.intelligence.scoring.priority_engine import compute_priority
from app.ai.intelligence.scoring.rule_engine import (
    severity_rule,
    frequency_rule,
    hotspot_rule,
    location_rule,
    confidence_rule,
)


def test_individual_rules():
    assert severity_rule("Healthcare") == 95.0
    assert severity_rule("Green Spaces") == 30.0
    assert severity_rule("UnknownCategory") == 40.0

    # frequency caps at 20 (leads to 100.0)
    assert frequency_rule(0) == 0.0
    assert frequency_rule(5) == 25.0
    assert frequency_rule(20) == 100.0
    assert frequency_rule(30) == 100.0

    assert hotspot_rule(True) == 100.0
    assert hotspot_rule(False) == 0.0

    assert location_rule(50) == 50.0

    assert confidence_rule(0.92) == 92.0
    assert confidence_rule(0.50) == 50.0


def test_compute_priority_critical():
    # High severity (Healthcare = 95), Hotspot = True, High frequency, High confidence
    res = compute_priority(
        category="Healthcare",
        issue_count=20,
        is_hotspot=True,
        locality="Ward 12",
        ai_confidence=0.95,
    )
    # Expected weighted score:
    # sev: 95 * 0.3 = 28.5
    # freq: 100 * 0.25 = 25.0
    # hot: 100 * 0.2 = 20.0
    # loc: 50 * 0.15 = 7.5
    # conf: 95 * 0.1 = 9.5
    # Total = 28.5 + 25 + 20 + 7.5 + 9.5 = 90.5 -> 90 (Python rounds half to even)
    assert res["priority_score"] == 90
    assert res["priority_level"] == "CRITICAL"
    assert res["score_breakdown"]["severity"] == 95.0


def test_compute_priority_low():
    # Low severity (Green Spaces = 30), Hotspot = False, Freq = 0, Low confidence
    res = compute_priority(
        category="Green Spaces",
        issue_count=0,
        is_hotspot=False,
        locality="Ward 12",
        ai_confidence=0.40,
    )
    # Expected weighted:
    # sev: 30 * 0.3 = 9.0
    # freq: 0 * 0.25 = 0.0
    # hot: 0 * 0.2 = 0.0
    # loc: 50 * 0.15 = 7.5
    # conf: 40 * 0.1 = 4.0
    # Total = 9 + 0 + 0 + 7.5 + 4 = 20.5 -> 20 (Python rounds half to even)
    assert res["priority_score"] == 20
    assert res["priority_level"] == "LOW"

