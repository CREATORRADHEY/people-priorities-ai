"""
geo_utils.py — IE-4 Location Normalisation Helpers

Provides consistent, case-insensitive location string normalisation so
hotspot detection is not foiled by minor capitalisation differences
between submissions.
"""
import re


def normalize_locality(locality: str) -> str:
    """
    Normalize a locality string for consistent comparison.

    Lowercases, strips extra whitespace, and collapses internal spaces.
    """
    if not locality:
        return ""
    return re.sub(r"\s+", " ", locality.lower().strip())


def localities_match(a: str, b: str) -> bool:
    """
    Return True if two locality strings refer to the same location.

    Comparison is case-insensitive and whitespace-normalised.
    Also returns True if one string is a substring of the other
    (e.g. "Ward 12" matches "Ward 12, Delhi").
    """
    na = normalize_locality(a)
    nb = normalize_locality(b)
    if not na or not nb:
        return False
    return na == nb or na in nb or nb in na


def extract_locality(location: dict) -> str:
    """
    Extract the best available locality string from a location dict.

    Priority: locality → ward → district → "".
    """
    if not isinstance(location, dict):
        return ""
    return (
        location.get("locality")
        or location.get("ward")
        or location.get("district")
        or ""
    )
