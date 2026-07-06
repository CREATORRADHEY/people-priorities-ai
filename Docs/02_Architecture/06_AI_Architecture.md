Project: People's Priorities AI

Version: 1.0

Status: Draft → Review → Locked

Owner: AI Engineering Team

1. Purpose

This document defines the AI architecture for the People's Priorities AI platform.

It specifies:

AI responsibilities
AI service boundaries
Prompt lifecycle
Model selection
AI data flow
Prompt contracts
Output validation
Retry strategies
Explainability
AI observability

This document is the authoritative reference for all AI-related implementation.

2. AI Philosophy

The AI layer exists to understand, organize, and explain.

It does not replace government decision-making.

The AI layer has three responsibilities:

Understand citizen input.
Discover community-level patterns.
Explain recommendations.

The AI does not:

Decide budgets.
Allocate funds.
Approve projects.
Replace MPs.
3. AI Design Principles
AI-001

AI understands.

Software decides.

AI-002

Every AI output must be validated.

Never trust raw LLM output.

AI-003

Every AI prompt has exactly one responsibility.

Never create giant prompts.

AI-004

AI never directly writes to Firestore.

Business services own persistence.

AI-005

AI outputs structured JSON.

Never paragraphs unless specifically requested.

4. AI Layer Overview
                 AI Layer

        ┌──────────────────────┐
        │ Understanding Engine │
        └──────────────────────┘

        ┌──────────────────────┐
        │ Embedding Engine     │
        └──────────────────────┘

        ┌──────────────────────┐
        │ Recommendation Engine│
        └──────────────────────┘

Each engine has one responsibility.

5. AI Service 1
Understanding Engine

Purpose

Convert raw citizen submissions into StructuredIssue objects.

Inputs

Text
Voice Transcript
Images
Location

Output

StructuredIssue

Never

Decision

Recommendation

Priority

Tasks

Language Detection
Translation (if needed)
Category Classification
Severity Extraction
Entity Extraction
Summary Generation

Model

Gemini 2.5 Flash (or latest stable available during the hackathon)

Reason

Fast

Low cost

Structured output

Multimodal

Temperature

0.2

Reason

We want consistency.

Not creativity.

6. AI Service 2
Embedding Engine

Purpose

Generate embeddings for semantic similarity.

Responsibilities

Duplicate Detection
Similarity Search
Clustering Support

Output

Vector Embedding

Never

Recommendation

Model

Google Embedding Model

7. AI Service 3
Recommendation Engine

Purpose

Generate DecisionBrief.

Input

EvidenceObject

PriorityAssessment

Output

DecisionBrief

Responsibilities

Explain recommendation
Generate executive summary
Explain evidence
Produce human-readable reasoning

Never

Calculate priority.

Model

Gemini 2.5 Pro (or latest reasoning-capable model if available)

Reason

Better reasoning.

Temperature

0.4

8. AI Request Lifecycle
Citizen Submission
        │
        ▼
Understanding Engine
        │
        ▼
StructuredIssue
        │
        ▼
Embedding Engine
        │
        ▼
IssueCluster
        │
        ▼
Evidence Engine
        │
        ▼
Priority Engine
        │
        ▼
Recommendation Engine
        │
        ▼
DecisionBrief
9. Prompt Lifecycle

Every prompt follows:

Input

↓

System Prompt

↓

Business Rules

↓

JSON Schema

↓

Gemini

↓

Validation

↓

Retry

↓

Output
10. Prompt Standards

Every prompt contains:

Objective
Input
Context
Rules
Output Schema
Examples
Constraints

No prompt should exceed its responsibility.

11. Prompt Versioning

Example

Prompt ID

AI-UNDERSTANDING-001

Version

1.0

Future

1.1

1.2

2.0

Never overwrite prompts.

12. Output Validation

Every AI output passes validation.

Example

Gemini

↓

JSON Parser

↓

Schema Validation

↓

Business Validation

↓

Accepted

If validation fails

↓

Retry

13. Retry Strategy

Attempt 1

Normal Prompt

↓

Invalid JSON

↓

Attempt 2

Repair Prompt

↓

Still invalid

↓

Human-readable error

No infinite retries.

14. Fallback Strategy

If Gemini unavailable

Understanding Engine

↓

Store submission as Pending AI Processing

Recommendation Engine

↓

Return "Recommendation currently unavailable."

System remains operational.

15. AI Observability

Log:

Prompt ID
Model
Token count
Response latency
Validation result
Retry count
Cost estimate

Every AI request is traceable.

16. AI Guardrails

Never allow AI to:

Allocate public funds.
Generate political opinions.
Fabricate evidence.
Invent statistics.
Modify citizen submissions.
Skip missing evidence.

If evidence is missing

AI must explicitly state it.

17. Prompt Categories
Prompt	Purpose
AI-001	Submission Understanding
AI-002	Image Analysis
AI-003	Language Detection
AI-004	StructuredIssue Generation
AI-005	DecisionBrief Generation
AI-006	Executive Summary
18. AI Quality Metrics

Understanding Engine

JSON validity
Classification accuracy
Entity extraction quality

Recommendation Engine

Explainability
Grounding in evidence
Consistency
No hallucinations
19. Cost Optimization

For MVP:

Use Flash models for extraction.
Use Pro models only for final reasoning.
Cache repeated requests.
Never regenerate identical outputs.
20. Future AI Roadmap

Future versions may include:

Multi-agent planning
Automatic infrastructure estimation
Budget optimization
Predictive constituency analysis
Continuous learning
Human feedback loops
21. AI Architecture Checklist

Before deploying any AI feature:

 One clear responsibility
 Prompt versioned
 JSON schema defined
 Output validated
 Retry implemented
 Logging enabled
 Fallback defined
 Cost reviewed
 Explainability verified