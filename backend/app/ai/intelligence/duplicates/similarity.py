"""
similarity.py — IE-3 Heuristic Similarity Scorer

Computes a similarity score between two submissions using a weighted
combination of three signals:

  similarity = (
      0.40 × category_match      (bool → 1.0 / 0.0)
    + 0.40 × locality_match      (bool → 1.0 / 0.0)
    + 0.20 × word_overlap_ratio  (Jaccard similarity on lowercased summary words)
  )

This interface is designed to be stable so that a future embedding-based
similarity implementation can replace word_overlap_ratio without changing
the caller in duplicate_detector.py.

Threshold: DUPLICATE_THRESHOLD = 0.75
"""

# ── Weights ───────────────────────────────────────────────────────────────────
CATEGORY_WEIGHT: float = 0.40
LOCALITY_WEIGHT: float = 0.40
WORD_OVERLAP_WEIGHT: float = 0.20

DUPLICATE_THRESHOLD: float = 0.75

# ── Stop words ────────────────────────────────────────────────────────────────
_STOP_WORDS: frozenset[str] = frozenset({
    "a", "an", "the", "is", "in", "on", "at", "of", "for", "to",
    "and", "or", "but", "not", "with", "from", "by", "are", "was",
    "been", "has", "have", "that", "this", "it", "its", "their",
    "there", "they", "our", "be", "as", "which", "very", "also",
})


def compute_similarity(
    category_a: str,
    locality_a: str,
    summary_a: str,
    category_b: str,
    locality_b: str,
    summary_b: str,
) -> float:
    """
    Compute a [0.0, 1.0] similarity score between two submissions.

    Args:
        category_a / _b: Primary category strings.
        locality_a / _b: Locality strings (ward, district, or locality field).
        summary_a / _b:  Normalized English summary strings.

    Returns:
        Float in [0.0, 1.0].
    """
    cat_score = _category_match(category_a, category_b)
    loc_score = _locality_match(locality_a, locality_b)
    text_score = _word_overlap(summary_a, summary_b)

    return round(
        CATEGORY_WEIGHT * cat_score
        + LOCALITY_WEIGHT * loc_score
        + WORD_OVERLAP_WEIGHT * text_score,
        4,
    )


def is_duplicate(similarity: float) -> bool:
    """Return True if similarity meets or exceeds DUPLICATE_THRESHOLD."""
    return similarity >= DUPLICATE_THRESHOLD


# ── Private helpers ───────────────────────────────────────────────────────────

def _category_match(a: str, b: str) -> float:
    return 1.0 if a.lower().strip() == b.lower().strip() else 0.0


def _locality_match(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return 1.0 if a.lower().strip() == b.lower().strip() else 0.0


def _tokenize(text: str) -> set[str]:
    """Lowercase, split on whitespace/punctuation, remove stop words."""
    import re
    tokens = re.findall(r"[a-z]+", text.lower())
    return {t for t in tokens if t not in _STOP_WORDS and len(t) > 2}


def _word_overlap(a: str, b: str) -> float:
    """Jaccard similarity on meaningful word tokens."""
    if not a or not b:
        return 0.0
    tokens_a = _tokenize(a)
    tokens_b = _tokenize(b)
    if not tokens_a or not tokens_b:
        return 0.0
    intersection = tokens_a & tokens_b
    union = tokens_a | tokens_b
    return len(intersection) / len(union)
