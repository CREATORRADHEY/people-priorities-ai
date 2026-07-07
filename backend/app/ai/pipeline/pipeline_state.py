"""
pipeline_state.py

Enumeration of all pipeline state values.

Every state transition is persisted to Firestore, not only COMPLETED/FAILED,
so monitoring dashboards and admin tools can reconstruct the exact processing
timeline for any submission.
"""
from enum import Enum


class PipelineState(str, Enum):
    """
    Ordered pipeline state machine.

    States flow linearly: RECEIVED → … → COMPLETED.
    Any state can transition to FAILED on an unrecoverable error.
    """
    RECEIVED = "RECEIVED"
    PROMPT_LOADING = "PROMPT_LOADING"
    AI_PROCESSING = "AI_PROCESSING"
    PARSING = "PARSING"
    PERSISTING = "PERSISTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
