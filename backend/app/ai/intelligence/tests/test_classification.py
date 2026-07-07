"""
test_classification.py — IE-1 Classification Engine Unit Tests
"""
import pytest
from app.ai.intelligence.classification.classifier import classify
from app.ai.intelligence.classification.rules import CANONICAL_CATEGORIES


def test_classify_exact_match():
    # Category exists exactly in canonical list
    res = classify("Electricity", ["Street Light", "Power Cut"], 0.90)
    assert res["primary_category"] == "Electricity"
    assert res["was_normalised"] is False
    assert res["category_confidence"] == 0.90


def test_classify_case_insensitive_match():
    # Category matches case-insensitively
    res = classify("electricity", ["Street Light"], 0.90)
    assert res["primary_category"] == "Electricity"
    assert res["was_normalised"] is True
    # Confidence penalty = 0.05
    assert res["category_confidence"] == 0.85


def test_classify_alias_lookup():
    # Category is a known alias
    res = classify("drinking water", ["tap water"], 0.95)
    assert res["primary_category"] == "Water Supply"
    assert res["was_normalised"] is True
    assert res["category_confidence"] == 0.90


def test_classify_partial_match():
    # Partial matching rules
    res = classify("some road repair stuff", [], 0.80)
    assert res["primary_category"] == "Road Infrastructure"
    assert res["was_normalised"] is True
    assert res["category_confidence"] == 0.75


def test_classify_fallback():
    # Fallback to Other
    res = classify("completely unknown category name", [], 0.70)
    assert res["primary_category"] == "Other"
    assert res["was_normalised"] is True
    assert res["category_confidence"] == 0.65


def test_secondary_category_inference_direct_map():
    # Road Infrastructure maps to Public Safety in rules.py
    res = classify("Road Infrastructure", ["broken pavement"], 0.90)
    assert res["primary_category"] == "Road Infrastructure"
    assert res["secondary_category"] == "Public Safety"


def test_secondary_category_inference_theme_override():
    # Water Supply primary, but theme contains crime/safety hint
    res = classify("Water Supply", ["tap water", "theft", "police"], 0.90)
    assert res["primary_category"] == "Water Supply"
    assert res["secondary_category"] == "Public Safety"
