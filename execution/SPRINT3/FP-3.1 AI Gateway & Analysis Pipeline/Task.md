📦 Feature Pack FP-3.1
AI Gateway & Analysis Pipeline Foundation

Sprint: 3
Priority: P0 (Highest)
Estimated Time: 5–6 Hours

Dependencies

AAD-01 ✅
FP-2.4 ✅
Objective

Build the AI foundation that transforms a stored submission into structured intelligence.

This Feature Pack does not implement sophisticated scoring yet. It builds the pipeline and AI gateway that every future AI capability will use.

Scope
✅ Implement
AI Gateway
Gemini Adapter
Prompt Manager
AI Pipeline Orchestrator
Structured JSON parser
Analysis persistence
Pipeline state tracking
AI observability
❌ Do NOT Implement
Priority scoring logic
Hotspot clustering
Dashboard
Embeddings
Vector search
High-Level Flow
Citizen Submission
        │
        ▼
Firestore
        │
        ▼
AI Pipeline
        │
        ▼
AI Gateway
        │
        ▼
Gemini
        │
        ▼
Structured Analysis
        │
        ▼
analysis/
Folder Structure
backend/app/ai/

gateway/
│
├── base_gateway.py
├── gemini_gateway.py
└── gateway_factory.py

pipeline/
│
├── analysis_pipeline.py
├── pipeline_state.py
└── pipeline_result.py

prompts/
│
├── system.md
├── classification.md
├── summary.md
├── themes.md
└── output_schema.md

models/
│
├── analysis.py
└── ai_response.py

utils/
│
├── json_parser.py
├── prompt_loader.py
└── metrics.py

tests/
AI Gateway

Only this layer may call Gemini.

Pipeline

↓

Gateway

↓

Gemini SDK

Interface

class BaseAIGateway:

    async def generate(
        self,
        prompt: str,
        schema: dict
    ) -> AIResponse:
        ...
Gemini Adapter

Responsibilities

Load Gemini model
Retry failed requests
Handle timeout
Parse response
Return structured object

No prompt logic here.

Prompt Loader

Create

prompt_loader.py

Responsibilities

Prompt Name

↓

Load Markdown

↓

Inject Variables

↓

Return Final Prompt

Example

load_prompt(
    "classification",
    {
        "submission": ...
    }
)
Structured Output Contract

Every Gemini response must follow one schema.

Example

{
  "summary": "...",

  "language": "...",

  "category": "...",

  "themes": [],

  "confidence": 0.91,

  "reasoning": "...",

  "recommendation": "..."
}

If parsing fails

↓

Retry once

↓

Fail gracefully

Pipeline

Pipeline responsibilities

Submission

↓

Load Prompt

↓

Gateway

↓

Gemini

↓

JSON Validation

↓

Persist Analysis

↓

Return Result
Firestore

Create

analysis/

    analysisId

        submissionId

        summary

        category

        language

        themes

        recommendation

        confidence

        pipelineState

        processedAt
Pipeline State
RECEIVED

↓

PROMPT_LOADING

↓

AI_PROCESSING

↓

PARSING

↓

PERSISTING

↓

COMPLETED

↓

FAILED
AI Observability

Every run stores

requestId

submissionId

model

promptVersion

latency

estimatedTokens

success

failureReason

Even if only logged initially, keep the structure ready.

Acceptance Criteria
 AI Gateway implemented
 Gemini adapter implemented
 Prompt loader implemented
 Pipeline orchestrator implemented
 JSON validation works
 Analysis stored
 Pipeline states tracked
 Tests pass
 Build passes
Git Commit
feat(ai): implement gateway and analysis pipeline