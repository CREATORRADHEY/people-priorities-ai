"""
AI-specific exception hierarchy for People's Priorities AI.

These exceptions are raised by the AI subsystem and must never propagate
directly to the API layer unhandled. The pipeline catches them, transitions
to FAILED state, and surfaces a structured error response.
"""


class AIException(Exception):
    """Base class for all AI subsystem exceptions."""
    pass


class AIGatewayException(AIException):
    """
    Raised when the AI gateway (Gemini) returns an error, times out,
    or fails after the configured retry attempts.
    """
    pass


class PromptException(AIException):
    """
    Raised when a prompt file cannot be loaded, the version manifest
    is missing, or template variable injection fails.
    """
    pass


class ParsingException(AIException):
    """
    Raised when the AI response cannot be parsed as valid JSON or when
    the parsed object does not conform to the expected output schema.
    """
    pass


class PipelineException(AIException):
    """
    Raised for errors that occur within the pipeline orchestrator itself,
    such as invalid state transitions or failed repository persistence.
    """
    pass
