"""
test_analysis_pipeline.py

Unit tests for the two-stage AnalysisPipeline.

Covers:
  - Happy path: Stage 1 + Stage 2 complete → COMPLETED state, AnalysisResult built
  - Human Review: confidence < 0.85 → reviewRequired = True
  - High confidence: confidence >= 0.85 → reviewRequired = False
  - Stage 1 failure → FAILED state, no Stage 2 call
  - Stage 2 failure → FAILED state
  - Firestore failure during bootstrap → early FAILED return
  - All state transitions persisted to repository
"""
import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.ai.exceptions import AIGatewayException, ParsingException
from app.ai.gateway.base_gateway import BaseAIGateway
from app.ai.models.ai_response import AIMetrics, AIResponse
from app.ai.pipeline.analysis_pipeline import AnalysisPipeline
from app.ai.pipeline.pipeline_state import PipelineState
from app.ai.repositories.base_analysis_repository import (
    BaseAnalysisRepository,
    AnalysisDatabaseException,
)

# ── Test Fixtures ─────────────────────────────────────────────────────────────

_STAGE1_PARSED = {
    "summary": "Streetlights are not working near MG Road.",
    "language": "en",
    "translatedText": None,
}

_STAGE2_PARSED = {
    "category": "Electricity",
    "themes": ["Street Lighting", "Road Safety"],
    "confidence": 0.91,
    "recommendation": "Repair street lighting on MG Road within 48 hours.",
    "reasoning": "Clear issue with specific location and direct action.",
}

_STAGE2_LOW_CONFIDENCE = {**_STAGE2_PARSED, "confidence": 0.70}

_SUBMISSION_DATA = {
    "information": {
        "issueDescription": "Streetlights not working near MG Road.",
        "category": "Electricity",
    },
    "location": {"locality": "MG Road", "ward": "Ward 5"},
}

_GOOD_METRICS = AIMetrics(
    model="gemini-2.5-flash",
    prompt_version="1.0",
    latency_ms=250.0,
    input_tokens=100,
    output_tokens=80,
    estimated_cost_usd=0.00003,
    success=True,
)


def _make_ai_response(parsed: dict) -> AIResponse:
    return AIResponse(
        raw=json.dumps(parsed),
        parsed=parsed,
        metrics=_GOOD_METRICS,
    )


class MockGateway(BaseAIGateway):
    """Controllable mock gateway for pipeline tests."""

    def __init__(self, stage1_result=None, stage2_result=None,
                 stage1_error=None, stage2_error=None):
        self._stage1_result = stage1_result
        self._stage2_result = stage2_result
        self._stage1_error = stage1_error
        self._stage2_error = stage2_error
        self._calls = []

    async def generate(self, prompt, prompt_name, prompt_version, output_schema) -> AIResponse:
        self._calls.append(prompt_name)
        if prompt_name == "stage1_normalize":
            if self._stage1_error:
                raise self._stage1_error
            return self._stage1_result
        if prompt_name == "stage2_reason":
            if self._stage2_error:
                raise self._stage2_error
            return self._stage2_result
        raise ValueError(f"Unexpected prompt_name: {prompt_name}")


class MockRepository(BaseAnalysisRepository):
    """In-memory mock repository."""

    def __init__(self, fail_on_create=False):
        self._docs: dict[str, dict] = {}
        self._state_updates: list[dict] = []
        self._fail_on_create = fail_on_create
        self._id_counter = 0

    async def create_analysis(self, payload: dict) -> str:
        if self._fail_on_create:
            raise AnalysisDatabaseException("Firestore unavailable")
        self._id_counter += 1
        doc_id = f"mock-analysis-{self._id_counter}"
        self._docs[doc_id] = payload
        return doc_id

    async def get_analysis(self, analysis_id: str) -> dict | None:
        return self._docs.get(analysis_id)

    async def get_analysis_by_submission(self, submission_id: str) -> dict | None:
        return None

    async def update_pipeline_state(
        self, analysis_id: str, state: str, state_history: list
    ) -> bool:
        self._state_updates.append({"id": analysis_id, "state": state})
        if analysis_id in self._docs:
            self._docs[analysis_id]["pipelineState"] = state
            self._docs[analysis_id]["stateHistory"] = state_history
        return True


# ── Tests ─────────────────────────────────────────────────────────────────────

class TestAnalysisPipelineHappyPath:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_result=_make_ai_response(_STAGE2_PARSED),
        )
        self.repo = MockRepository()
        self.pipeline = AnalysisPipeline(gateway=self.gateway, repository=self.repo)

    @pytest.mark.asyncio
    async def test_returns_success_true(self):
        result = await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.success is True

    @pytest.mark.asyncio
    async def test_pipeline_state_completed(self):
        result = await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.pipeline_state == PipelineState.COMPLETED

    @pytest.mark.asyncio
    async def test_both_stages_called(self):
        await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert "stage1_normalize" in self.gateway._calls
        assert "stage2_reason" in self.gateway._calls

    @pytest.mark.asyncio
    async def test_analysis_result_fields(self):
        result = await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.analysis.category == "Electricity"
        assert result.analysis.language == "en"
        assert "Street Lighting" in result.analysis.themes
        assert result.analysis.confidence == 0.91

    @pytest.mark.asyncio
    async def test_analysis_id_assigned(self):
        result = await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.analysis_id is not None

    @pytest.mark.asyncio
    async def test_versioning_fields_present(self):
        result = await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.analysis.processingVersion == "1.0.0"
        assert result.analysis.pipelineVersion == "1.0"
        assert result.analysis.promptVersion == "v1"

    @pytest.mark.asyncio
    async def test_state_transitions_persisted(self):
        await self.pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        persisted_states = [u["state"] for u in self.repo._state_updates]
        # Must include at least AI_PROCESSING and PERSISTING transitions
        assert PipelineState.AI_PROCESSING in persisted_states
        assert PipelineState.PERSISTING in persisted_states


class TestHumanReviewLayer:
    @pytest.mark.asyncio
    async def test_review_required_false_when_high_confidence(self):
        gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_result=_make_ai_response(_STAGE2_PARSED),  # confidence=0.91
        )
        pipeline = AnalysisPipeline(gateway=gateway, repository=MockRepository())
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.analysis.reviewRequired is False

    @pytest.mark.asyncio
    async def test_review_required_true_when_low_confidence(self):
        gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_result=_make_ai_response(_STAGE2_LOW_CONFIDENCE),  # confidence=0.70
        )
        pipeline = AnalysisPipeline(gateway=gateway, repository=MockRepository())
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.analysis.reviewRequired is True

    @pytest.mark.asyncio
    async def test_review_required_false_at_exact_threshold(self):
        gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_result=_make_ai_response({**_STAGE2_PARSED, "confidence": 0.85}),
        )
        pipeline = AnalysisPipeline(gateway=gateway, repository=MockRepository())
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        # 0.85 is NOT < 0.85, so reviewRequired = False
        assert result.analysis.reviewRequired is False


class TestPipelineFailures:
    @pytest.mark.asyncio
    async def test_stage1_failure_returns_failed_result(self):
        gateway = MockGateway(
            stage1_error=AIGatewayException("Gemini network error"),
        )
        repo = MockRepository()
        pipeline = AnalysisPipeline(gateway=gateway, repository=repo)
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.success is False
        assert result.pipeline_state == PipelineState.FAILED
        assert "Gemini network error" in result.error_message

    @pytest.mark.asyncio
    async def test_stage2_not_called_when_stage1_fails(self):
        gateway = MockGateway(
            stage1_error=AIGatewayException("Stage 1 down"),
        )
        pipeline = AnalysisPipeline(gateway=gateway, repository=MockRepository())
        await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert "stage2_reason" not in gateway._calls

    @pytest.mark.asyncio
    async def test_stage2_failure_returns_failed_result(self):
        gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_error=ParsingException("Malformed JSON from Stage 2"),
        )
        pipeline = AnalysisPipeline(gateway=gateway, repository=MockRepository())
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.success is False
        assert result.pipeline_state == PipelineState.FAILED

    @pytest.mark.asyncio
    async def test_firestore_bootstrap_failure_returns_early_failed(self):
        gateway = MockGateway(
            stage1_result=_make_ai_response(_STAGE1_PARSED),
            stage2_result=_make_ai_response(_STAGE2_PARSED),
        )
        repo = MockRepository(fail_on_create=True)
        pipeline = AnalysisPipeline(gateway=gateway, repository=repo)
        result = await pipeline.run("sub-001", _SUBMISSION_DATA, "req-001")
        assert result.success is False
        assert result.pipeline_state == PipelineState.FAILED
        assert "stage1_normalize" not in gateway._calls  # Pipeline never started
