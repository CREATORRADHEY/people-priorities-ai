"""
rules.py — IE-1 Classification Rules

Single source of truth for:
  - The canonical government category taxonomy
  - Category aliases (Gemini off-taxonomy values → canonical)
  - Secondary category inference rules
  - Confidence penalty for category normalisation
"""

# ── Canonical taxonomy ────────────────────────────────────────────────────────
# This list must stay in sync with the Stage 2 prompt category list.
CANONICAL_CATEGORIES: list[str] = [
    "Water Supply",
    "Road Infrastructure",
    "Electricity",
    "Sanitation",
    "Healthcare",
    "Education",
    "Public Safety",
    "Drainage & Flooding",
    "Waste Management",
    "Green Spaces",
    "Housing",
    "Transportation",
    "Other",
]

# ── Alias map ─────────────────────────────────────────────────────────────────
# Maps common Gemini off-taxonomy outputs to the nearest canonical category.
# Keys are lower-cased for case-insensitive lookup.
CATEGORY_ALIASES: dict[str, str] = {
    # Water
    "water": "Water Supply",
    "drinking water": "Water Supply",
    "water shortage": "Water Supply",
    "tap water": "Water Supply",
    "pipeline": "Water Supply",
    # Roads
    "road": "Road Infrastructure",
    "roads": "Road Infrastructure",
    "road repair": "Road Infrastructure",
    "pothole": "Road Infrastructure",
    "potholes": "Road Infrastructure",
    "street": "Road Infrastructure",
    "footpath": "Road Infrastructure",
    "pavement": "Road Infrastructure",
    # Electricity
    "electric": "Electricity",
    "power": "Electricity",
    "power supply": "Electricity",
    "streetlight": "Electricity",
    "street lighting": "Electricity",
    "light": "Electricity",
    # Sanitation
    "sewage": "Sanitation",
    "sewer": "Sanitation",
    "toilet": "Sanitation",
    "open defecation": "Sanitation",
    "hygiene": "Sanitation",
    # Healthcare
    "health": "Healthcare",
    "hospital": "Healthcare",
    "clinic": "Healthcare",
    "medical": "Healthcare",
    "doctor": "Healthcare",
    # Education
    "school": "Education",
    "college": "Education",
    "teacher": "Education",
    # Public Safety
    "safety": "Public Safety",
    "crime": "Public Safety",
    "police": "Public Safety",
    "security": "Public Safety",
    "cciv": "Public Safety",
    "cctv": "Public Safety",
    # Drainage
    "drainage": "Drainage & Flooding",
    "flooding": "Drainage & Flooding",
    "flood": "Drainage & Flooding",
    "waterlogging": "Drainage & Flooding",
    "drain": "Drainage & Flooding",
    # Waste
    "garbage": "Waste Management",
    "waste": "Waste Management",
    "trash": "Waste Management",
    "litter": "Waste Management",
    "dumping": "Waste Management",
    # Housing
    "housing": "Housing",
    "shelter": "Housing",
    "slum": "Housing",
    # Transportation
    "bus": "Transportation",
    "transport": "Transportation",
    "metro": "Transportation",
    "auto": "Transportation",
    "traffic": "Transportation",
    # Green spaces
    "park": "Green Spaces",
    "garden": "Green Spaces",
    "tree": "Green Spaces",
    "trees": "Green Spaces",
    "plantation": "Green Spaces",
}

# ── Secondary category inference ──────────────────────────────────────────────
# Maps a primary category to the most common secondary category.
# Used when a theme provides a strong signal for a secondary classification.
SECONDARY_CATEGORY_MAP: dict[str, str] = {
    "Road Infrastructure": "Public Safety",
    "Electricity": "Public Safety",
    "Drainage & Flooding": "Water Supply",
    "Sanitation": "Healthcare",
    "Waste Management": "Sanitation",
    "Housing": "Sanitation",
}

# ── Confidence penalty ────────────────────────────────────────────────────────
# Applied when the Gemini category was not in the canonical taxonomy and
# required alias normalisation.
NORMALISATION_CONFIDENCE_PENALTY: float = 0.05
