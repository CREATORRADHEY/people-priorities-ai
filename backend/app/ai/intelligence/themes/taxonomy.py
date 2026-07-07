"""
taxonomy.py — IE-2 Canonical Government Theme Vocabulary

Single source of truth for standardised civic themes.

Structure:
  THEME_ALIASES: dict[str, str]
      Maps any known Gemini output (lowercase) to a canonical theme name.
      This is the primary lookup table used by the extractor.

  CANONICAL_THEMES: set[str]
      Derived set of all valid canonical theme strings.

Design rules:
  - One entry per canonical theme — no duplicates.
  - All alias keys must be lowercase.
  - Add new canonical themes here first, then add aliases below it.
"""

THEME_ALIASES: dict[str, str] = {
    # ── Road Infrastructure ───────────────────────────────────────────────
    "road": "Road Infrastructure",
    "roads": "Road Infrastructure",
    "road repair": "Road Infrastructure",
    "road issue": "Road Infrastructure",
    "road damage": "Road Infrastructure",
    "road condition": "Road Infrastructure",
    "broken road": "Road Infrastructure",
    "street": "Road Infrastructure",
    "streets": "Road Infrastructure",
    "road infrastructure": "Road Infrastructure",

    # ── Pothole Repair ────────────────────────────────────────────────────
    "pothole": "Pothole Repair",
    "potholes": "Pothole Repair",
    "pothole repair": "Pothole Repair",
    "pothole filling": "Pothole Repair",

    # ── Road Safety ───────────────────────────────────────────────────────
    "road safety": "Road Safety",
    "traffic safety": "Road Safety",
    "accident prone": "Road Safety",
    "speed breaker": "Road Safety",
    "pedestrian safety": "Road Safety",

    # ── Street Lighting ───────────────────────────────────────────────────
    "street lighting": "Street Lighting",
    "streetlight": "Street Lighting",
    "streetlights": "Street Lighting",
    "street light": "Street Lighting",
    "street lights": "Street Lighting",
    "lamp post": "Street Lighting",
    "no lighting": "Street Lighting",

    # ── Power Supply ──────────────────────────────────────────────────────
    "power supply": "Power Supply",
    "electricity": "Power Supply",
    "power": "Power Supply",
    "power cut": "Power Supply",
    "power outage": "Power Supply",
    "load shedding": "Power Supply",
    "voltage fluctuation": "Power Supply",
    "no electricity": "Power Supply",

    # ── Water Supply ──────────────────────────────────────────────────────
    "water supply": "Water Supply",
    "tap water": "Water Supply",
    "drinking water": "Water Supply",
    "water shortage": "Water Supply",
    "water interruption": "Water Supply",
    "tap water interruption": "Water Supply",
    "no water": "Water Supply",
    "water pressure": "Water Supply",

    # ── Urban Infrastructure ──────────────────────────────────────────────
    "urban infrastructure": "Urban Infrastructure",
    "infrastructure": "Urban Infrastructure",
    "civic infrastructure": "Urban Infrastructure",
    "basic amenities": "Urban Infrastructure",

    # ── Drainage & Flooding ───────────────────────────────────────────────
    "drainage": "Drainage & Flooding",
    "drain": "Drainage & Flooding",
    "flood": "Drainage & Flooding",
    "flooding": "Drainage & Flooding",
    "waterlogging": "Drainage & Flooding",
    "waterlogged": "Drainage & Flooding",
    "blocked drain": "Drainage & Flooding",

    # ── Waste Management ──────────────────────────────────────────────────
    "waste": "Waste Management",
    "garbage": "Waste Management",
    "trash": "Waste Management",
    "garbage collection": "Waste Management",
    "waste disposal": "Waste Management",
    "littering": "Waste Management",
    "dumping": "Waste Management",
    "open dumping": "Waste Management",
    "solid waste": "Waste Management",

    # ── Sanitation ────────────────────────────────────────────────────────
    "sanitation": "Sanitation",
    "sewage": "Sanitation",
    "sewer": "Sanitation",
    "public toilet": "Sanitation",
    "open defecation": "Sanitation",
    "hygiene": "Sanitation",

    # ── Public Safety ─────────────────────────────────────────────────────
    "public safety": "Public Safety",
    "safety": "Public Safety",
    "crime": "Public Safety",
    "security": "Public Safety",
    "cctv": "Public Safety",
    "surveillance": "Public Safety",

    # ── Healthcare Access ─────────────────────────────────────────────────
    "healthcare": "Healthcare Access",
    "health": "Healthcare Access",
    "hospital": "Healthcare Access",
    "clinic": "Healthcare Access",
    "medical": "Healthcare Access",
    "healthcare access": "Healthcare Access",

    # ── Education ─────────────────────────────────────────────────────────
    "education": "Education",
    "school": "Education",
    "teacher": "Education",
    "school infrastructure": "Education",

    # ── Green Spaces ──────────────────────────────────────────────────────
    "green spaces": "Green Spaces",
    "park": "Green Spaces",
    "garden": "Green Spaces",
    "tree plantation": "Green Spaces",
    "tree": "Green Spaces",
    "trees": "Green Spaces",

    # ── Transportation ────────────────────────────────────────────────────
    "transportation": "Transportation",
    "bus": "Transportation",
    "public transport": "Transportation",
    "metro": "Transportation",
    "traffic": "Transportation",
    "auto": "Transportation",

    # ── Housing ───────────────────────────────────────────────────────────
    "housing": "Housing",
    "shelter": "Housing",
    "slum": "Housing",
    "affordable housing": "Housing",
}

# Derived canonical set — all unique values in THEME_ALIASES
CANONICAL_THEMES: set[str] = set(THEME_ALIASES.values())
