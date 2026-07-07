"""
cost_estimator.py

Approximate USD cost calculation for Gemini API token usage.

Rates are approximations for gemini-2.5-flash based on publicly available
pricing at the time of writing. These are updated in config when pricing changes.
This module keeps cost logic isolated so it can be updated without touching
gateway or pipeline code.
"""

# Approximate USD per 1,000 tokens for gemini-2.5-flash
# Source: Google AI pricing, July 2026 — update as needed
_INPUT_COST_PER_1K_TOKENS: float = 0.000075   # $0.075 / 1M tokens
_OUTPUT_COST_PER_1K_TOKENS: float = 0.0003    # $0.30  / 1M tokens

# Fallback token estimation: ~4 characters per token (rough approximation)
_CHARS_PER_TOKEN: int = 4


def estimate_cost(
    input_tokens: int | None,
    output_tokens: int | None,
    model: str = "gemini-2.5-flash",
) -> float | None:
    """
    Calculate approximate USD cost for a single Gemini API call.

    Args:
        input_tokens:  Number of input tokens consumed. None if unknown.
        output_tokens: Number of output tokens generated. None if unknown.
        model:         Model name (currently one rate table applies).

    Returns:
        Approximate cost in USD, or None if token counts are unavailable.
    """
    if input_tokens is None and output_tokens is None:
        return None

    in_cost = ((input_tokens or 0) / 1000) * _INPUT_COST_PER_1K_TOKENS
    out_cost = ((output_tokens or 0) / 1000) * _OUTPUT_COST_PER_1K_TOKENS
    return round(in_cost + out_cost, 8)


def estimate_tokens_from_text(text: str) -> int:
    """
    Rough token count estimate from character length.

    Used when the Gemini SDK does not return exact usage metadata.
    """
    return max(1, len(text) // _CHARS_PER_TOKEN)
