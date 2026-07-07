# AI Translation & Reasoning Pipeline

The platform splits user-submitted raw citizen inputs (which can be unstructured, written in local dialects, or submitted as voice recordings) into a two-stage analysis pipeline. This division optimizes execution cost and translation accuracy.

---

## 1. Pipeline Execution Flow

The analysis pipeline is orchestrated by the backend service. It translates and structures inputs before feeding them to the reasoning layers.

```
       Citizen Submission (Audio/Text)
                    │
                    ▼
          ┌───────────────────┐
          │ PipelineContext   │ ──► Update state: RECEIVED
          └───────────────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Stage 1: Normalize│ ──► Translate regional dialects to English
          └───────────────────┘ ──► Update state: TRANSLATING
                    │
                    ▼
          ┌───────────────────┐
          │ Stage 2: Reason   │ ──► Classify category, extract themes
          └───────────────────┘ ──► Update state: ANALYZING
                    │
                    ▼
          ┌───────────────────┐
          │ JSON Validator    │ ──► Match Pydantic schema contracts
          └───────────────────┘ ──► Update state: COMPLETED
```

---

## 2. Prompt Versioning Architecture

To support prompt engineering iterations without modification of Python source files, prompts are versioned under independent filesystem folders:

```
backend/app/ai/prompts/
└── v1/
    ├── manifest.json               # Active prompt configuration map
    ├── translation_prompt.txt      # Stage 1: System prompt template
    └── reasoning_prompt.txt        # Stage 2: Classification system prompt
```

### Active Manifest Schema (`manifest.json`)
Declares the target prompt text files and config overrides:
```json
{
  "version": "1.0.0",
  "active": true,
  "stages": {
    "translation": {
      "template_file": "translation_prompt.txt",
      "temperature": 0.1
    },
    "reasoning": {
      "template_file": "reasoning_prompt.txt",
      "temperature": 0.2
    }
  }
}
```

---

## 3. Cost & Latency Metrics Tracking (`AIMetrics`)

Every prompt execution evaluates token usage and latency. This data is returned to the service layer inside an `AIMetrics` envelope and recorded for auditing:

```python
class AIMetrics(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    latency_ms: float
    cost_usd: float
```

### Cost Rates Calculation Policy
- **Input Tokens**: \$0.075 per 1M tokens (on standard `gemini-2.5-flash` model).
- **Output Tokens**: \$0.30 per 1M tokens.

This cost envelope is persisted directly into the `analysis` sub-collection inside Firestore to allow district officials to monitor AI operational costs in real-time.
