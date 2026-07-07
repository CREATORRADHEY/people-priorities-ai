"""
json_validator.py

Validates a parsed AI response dict against a named JSON schema
before Pydantic model construction.

This layer sits between raw gateway output and domain models,
providing an explicit structural check before any business logic runs.
"""
import jsonschema

from app.ai.exceptions import ParsingException


# ──────────────────────────────────────────────────────────────────────────────
# Stage output schemas
# ──────────────────────────────────────────────────────────────────────────────

STAGE1_SCHEMA: dict = {
    "type": "object",
    "required": ["summary", "language"],
    "properties": {
        "summary": {"type": "string", "minLength": 1},
        "language": {"type": "string", "minLength": 2},
        "translatedText": {"type": ["string", "null"]},
    },
    "additionalProperties": True,
}

STAGE2_SCHEMA: dict = {
    "type": "object",
    "required": ["category", "themes", "confidence", "recommendation", "reasoning"],
    "properties": {
        "category": {"type": "string", "minLength": 1},
        "themes": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
        },
        "confidence": {"type": "number", "minimum": 0.0, "maximum": 1.0},
        "recommendation": {"type": "string", "minLength": 1},
        "reasoning": {"type": "string", "minLength": 1},
    },
    "additionalProperties": True,
}

_SCHEMAS: dict[str, dict] = {
    "stage1_normalize": STAGE1_SCHEMA,
    "stage2_reason": STAGE2_SCHEMA,
}


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def validate_response(data: dict, stage_name: str) -> None:
    """
    Validate *data* against the JSON schema registered for *stage_name*.

    Args:
        data:       Parsed Python dict from AI gateway response.
        stage_name: One of "stage1_normalize" or "stage2_reason".

    Raises:
        ParsingException: If validation fails or the stage name is unknown.
    """
    schema = _SCHEMAS.get(stage_name)
    if schema is None:
        raise ParsingException(
            f"No validation schema registered for stage '{stage_name}'. "
            f"Available: {list(_SCHEMAS.keys())}"
        )
    try:
        jsonschema.validate(instance=data, schema=schema)
    except jsonschema.ValidationError as exc:
        raise ParsingException(
            f"AI response for '{stage_name}' failed schema validation: {exc.message}"
        ) from exc
