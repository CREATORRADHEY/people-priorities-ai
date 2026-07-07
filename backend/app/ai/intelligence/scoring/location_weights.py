"""
location_weights.py — IE-5 Location Weight Provider

Returns a normalized [0–100] importance score for a given ward or locality.

For the hackathon, all wards are treated with equal weight (50/100).
The function signature is stable so a real district configuration table
can be substituted in a future sprint without changing priority_engine.py.
"""

# Default weight for all wards when no specific table is available.
_DEFAULT_LOCATION_WEIGHT: int = 50


def get_location_weight(locality: str) -> int:
    """
    Return a [0–100] importance weight for the given locality.

    Args:
        locality: Ward, district, or locality string from the submission.

    Returns:
        Integer weight in [0, 100].
        Current implementation returns the same default for all locations.
    """
    # Future: load from a YAML/JSON district configuration file.
    # Example: {"Ward 12": 80, "Central Delhi": 90, ...}
    return _DEFAULT_LOCATION_WEIGHT
