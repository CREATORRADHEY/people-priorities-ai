"""
policy.py — IE-5 Scoring Policy

Single source of truth for all Priority Engine constants:
  - Component weights
  - Category severity risk table
  - Priority level thresholds
  - Hotspot and duplicate bonuses/penalties

No computation here — only data. All scoring logic lives in rule_engine.py.
"""

# ── Component weights (must sum to 1.0) ───────────────────────────────────────
WEIGHT_SEVERITY: float = 0.30
WEIGHT_FREQUENCY: float = 0.25
WEIGHT_HOTSPOT: float = 0.20
WEIGHT_LOCATION: float = 0.15
WEIGHT_CONFIDENCE: float = 0.10

# ── Category severity risk table ─────────────────────────────────────────────
# Score 0–100 representing the inherent severity of issues in each category.
# Higher = more severe / more urgent government response expected.
CATEGORY_SEVERITY: dict[str, int] = {
    "Healthcare": 95,
    "Public Safety": 90,
    "Drainage & Flooding": 85,
    "Water Supply": 80,
    "Electricity": 75,
    "Sanitation": 72,
    "Road Infrastructure": 70,
    "Education": 65,
    "Transportation": 60,
    "Waste Management": 55,
    "Housing": 50,
    "Green Spaces": 30,
    "Other": 40,
}

DEFAULT_SEVERITY: int = 40   # Used when category is not in the table

# ── Hotspot bonus ──────────────────────────────────────────────────────────────
# Score 0–100 contributed by the WEIGHT_HOTSPOT component.
HOTSPOT_SCORE: int = 100     # Is a hotspot
NON_HOTSPOT_SCORE: int = 0   # Not a hotspot

# ── Frequency normalisation ───────────────────────────────────────────────────
# issue_count is normalised to 0–100 for the WEIGHT_FREQUENCY component.
FREQUENCY_CAP: int = 20      # issue_count ≥ this → frequency_score = 100

# ── Priority level thresholds ─────────────────────────────────────────────────
# priority_score → level
PRIORITY_LEVELS: list[tuple[int, str]] = [
    (80, "CRITICAL"),
    (60, "HIGH"),
    (40, "MEDIUM"),
    (0, "LOW"),
]
