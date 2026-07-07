"""
test_ai_gateway.py

Unit tests for GeminiGateway.

Covers:
  - Happy path: valid JSON response parsed and schema-validated
  - Retry: first attempt returns malformed JSON, second returns valid JSON
  - Hard parse failure: both attempts fail → ParsingException raised
  - SDK network error → AIGatewayException raised
  - Observability: AIMetrics populated on success
  - Cost estimation: estimated_cost_usd is a positive float
"""
import json
import pytest
from unittest.mock import MagicMock, patch, AsyncMock

from app.ai.exceptions import AIGatewayException, ParsingException
from app.ai.gateway.gemini_gateway import GeminiGateway
from app.ai.utils.json_validator import STAGE1_SCHEMA

# ── Fixtures ──────────────────────────────────────────────────────────────────

VALID_STAGE1_RESPONSE = {
    "summary": "Streetlights are not working near MG Road.",
    "language": "en",
    "translatedText": None,
}

VALID_STAGE1_JSON = json.dumps(VALID_STAGE1_RESPONSE)


def _make_mock_response(text: str) -> MagicMock:
    """Build a minimal mock of a Gemini GenerateContentResponse."""
    mock = MagicMock()
    mock.text = text
    mock.usage_metadata = None
    return mock


# ── Tests ─────────────────────────────────────────────────────────────────────

class TestGeminiGatewayHappyPath:
    @pytest.fixture(autouse=True)
    def patch_genai(self):
        with patch("app.ai.gateway.gemini_gateway.genai") as mock_genai:
            mock_model = MagicMock()
            mock_genai.GenerativeModel.return_value = mock_model
            mock_genai.GenerationConfig = MagicMock()
            mock_model.generate_content.return_value = _make_mock_response(VALID_STAGE1_JSON)
            self.mock_model = mock_model
            yield mock_genai

    @pytest.mark.asyncio
    async def test_returns_ai_response_on_valid_json(self):
        gateway = GeminiGateway()
        response = await gateway.generate(
            prompt="test prompt",
            prompt_name="stage1_normalize",
            prompt_version="1.0",
            output_schema=STAGE1_SCHEMA,
        )
        assert response.parsed["summary"] == VALID_STAGE1_RESPONSE["summary"]
        assert response.parsed["language"] == "en"
        assert response.raw == VALID_STAGE1_JSON

    @pytest.mark.asyncio
    async def test_metrics_populated_on_success(self):
        gateway = GeminiGateway()
        response = await gateway.generate(
            prompt="test prompt",
            prompt_name="stage1_normalize",
            prompt_version="1.0",
            output_schema=STAGE1_SCHEMA,
        )
        assert response.metrics.success is True
        assert response.metrics.latency_ms >= 0
        assert response.metrics.failure_reason is None

    @pytest.mark.asyncio
    async def test_cost_estimation_positive(self):
        gateway = GeminiGateway()
        response = await gateway.generate(
            prompt="test prompt",
            prompt_name="stage1_normalize",
            prompt_version="1.0",
            output_schema=STAGE1_SCHEMA,
        )
        assert response.metrics.estimated_cost_usd is not None
        assert response.metrics.estimated_cost_usd > 0

    @pytest.mark.asyncio
    async def test_strips_markdown_fences(self):
        """Response wrapped in ```json fences is still parsed correctly."""
        fenced = f"```json\n{VALID_STAGE1_JSON}\n```"
        self.mock_model.generate_content.return_value = _make_mock_response(fenced)
        gateway = GeminiGateway()
        response = await gateway.generate(
            prompt="test prompt",
            prompt_name="stage1_normalize",
            prompt_version="1.0",
            output_schema=STAGE1_SCHEMA,
        )
        assert response.parsed["language"] == "en"


class TestGeminiGatewayRetry:
    @pytest.fixture(autouse=True)
    def patch_genai(self):
        with patch("app.ai.gateway.gemini_gateway.genai") as mock_genai:
            mock_model = MagicMock()
            mock_genai.GenerativeModel.return_value = mock_model
            mock_genai.GenerationConfig = MagicMock()
            # First call: malformed JSON; second call: valid JSON
            mock_model.generate_content.side_effect = [
                _make_mock_response("This is not JSON at all"),
                _make_mock_response(VALID_STAGE1_JSON),
            ]
            self.mock_model = mock_model
            yield mock_genai

    @pytest.mark.asyncio
    async def test_retries_on_parse_failure_and_succeeds(self):
        gateway = GeminiGateway()
        response = await gateway.generate(
            prompt="test prompt",
            prompt_name="stage1_normalize",
            prompt_version="1.0",
            output_schema=STAGE1_SCHEMA,
        )
        assert self.mock_model.generate_content.call_count == 2
        assert response.parsed["language"] == "en"


class TestGeminiGatewayFailures:
    @pytest.fixture(autouse=True)
    def patch_genai_both_fail(self):
        with patch("app.ai.gateway.gemini_gateway.genai") as mock_genai:
            mock_model = MagicMock()
            mock_genai.GenerativeModel.return_value = mock_model
            mock_genai.GenerationConfig = MagicMock()
            mock_model.generate_content.return_value = _make_mock_response("not json")
            self.mock_model = mock_model
            yield mock_genai

    @pytest.mark.asyncio
    async def test_raises_parsing_exception_after_max_retries(self):
        gateway = GeminiGateway()
        with pytest.raises(ParsingException):
            await gateway.generate(
                prompt="test prompt",
                prompt_name="stage1_normalize",
                prompt_version="1.0",
                output_schema=STAGE1_SCHEMA,
            )

    @pytest.mark.asyncio
    async def test_raises_ai_gateway_exception_on_sdk_error(self):
        with patch("app.ai.gateway.gemini_gateway.genai") as mock_genai:
            mock_model = MagicMock()
            mock_genai.GenerativeModel.return_value = mock_model
            mock_genai.GenerationConfig = MagicMock()
            mock_model.generate_content.side_effect = ConnectionError("Network failure")

            gateway = GeminiGateway()
            with pytest.raises(AIGatewayException, match="Gemini API error"):
                await gateway.generate(
                    prompt="test prompt",
                    prompt_name="stage1_normalize",
                    prompt_version="1.0",
                    output_schema=STAGE1_SCHEMA,
                )

    @pytest.mark.asyncio
    async def test_schema_validation_missing_required_field(self):
        """Response missing required 'language' field fails schema validation."""
        bad_response = json.dumps({"summary": "Water issue."})  # missing 'language'
        with patch("app.ai.gateway.gemini_gateway.genai") as mock_genai:
            mock_model = MagicMock()
            mock_genai.GenerativeModel.return_value = mock_model
            mock_genai.GenerationConfig = MagicMock()
            mock_model.generate_content.return_value = _make_mock_response(bad_response)

            gateway = GeminiGateway()
            with pytest.raises(ParsingException):
                await gateway.generate(
                    prompt="test prompt",
                    prompt_name="stage1_normalize",
                    prompt_version="1.0",
                    output_schema=STAGE1_SCHEMA,
                )
