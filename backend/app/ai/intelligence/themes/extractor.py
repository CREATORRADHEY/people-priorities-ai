"""
extractor.py — IE-2 Theme Normalization Engine

Normalises the raw theme list from Gemini against the canonical taxonomy,
deduplicates, and returns a clean sorted list of government-standard themes.

Algorithm per theme:
  1. Lowercase + strip
  2. Exact alias lookup
  3. Partial alias key match (substring scan)
  4. Fallback: title-case the original value (no penalty)
"""
from app.ai.intelligence.themes.taxonomy import THEME_ALIASES, CANONICAL_THEMES
from app.core.logging import logger


def normalize_themes(raw_themes: list[str]) -> list[str]:
    """
    Normalize a list of raw Gemini themes to canonical government taxonomy terms.

    Deduplicates the result before returning.

    Args:
        raw_themes: Theme list from AnalysisResult.themes

    Returns:
        Sorted, deduplicated list of canonical theme strings.
    """
    normalized: list[str] = []
    seen: set[str] = set()

    for raw in raw_themes:
        canonical = _resolve_theme(raw)
        if canonical not in seen:
            seen.add(canonical)
            normalized.append(canonical)

    return sorted(normalized)


# ── Private helpers ───────────────────────────────────────────────────────────

def _resolve_theme(raw: str) -> str:
    """
    Resolve a single raw theme string to a canonical taxonomy term.

    Priority:
      1. Already canonical (exact match in CANONICAL_THEMES)
      2. Exact alias lookup (case-insensitive)
      3. Partial alias key scan (substring match)
      4. Fallback: title-case the original
    """
    # Already canonical
    if raw in CANONICAL_THEMES:
        return raw

    lower = raw.lower().strip()

    # Exact alias key match
    if lower in THEME_ALIASES:
        return THEME_ALIASES[lower]

    # Partial alias key match (e.g. "Road Repair Issues" matches "road repair")
    for alias_key, canonical in THEME_ALIASES.items():
        if alias_key in lower:
            return canonical

    # Partial reverse match (e.g. raw is "Infrastructure" and alias is "urban infrastructure")
    for alias_key, canonical in THEME_ALIASES.items():
        if lower in alias_key:
            return canonical

    # Fallback: title-case passthrough
    fallback = raw.strip().title()
    logger.debug(f"[IE-2] Theme '{raw}' not in taxonomy — passthrough as '{fallback}'")
    return fallback
