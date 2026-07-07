📦 Feature Pack FP-3.2
Intelligence Engine

Sprint: 3
Priority: P0 (Highest)
Estimated Time: 6-8 Hours

Dependencies

FP-3.1 ✅
AAD-01 ✅
Objective

Transform a basic AI analysis into actionable government intelligence.

Instead of only answering:

"What is this issue?"

The system should answer:

How serious is it?
Has it happened before?
Where is it happening?
What should be fixed first?
Why?
Scope
✅ Implement
Classification Engine
Theme Extraction
Duplicate Detection
Hotspot Detection
Priority Scoring
Recommendation Ranking
Intelligence Repository
❌ Do NOT Implement
Dashboard UI
Authentication
RAG
Embeddings
Vector Database
Intelligence Pipeline
Submission

↓

AI Analysis (FP-3.1)

↓

Classification

↓

Theme Extraction

↓

Duplicate Detection

↓

Hotspot Detection

↓

Priority Scoring

↓

Recommendation Ranking

↓

Intelligence Stored
Folder Structure
backend/app/ai/

intelligence/

├── classification/
│   ├── classifier.py
│   └── rules.py
│
├── themes/
│   ├── extractor.py
│   └── taxonomy.py
│
├── duplicates/
│   ├── duplicate_detector.py
│   └── similarity.py
│
├── hotspots/
│   ├── hotspot_detector.py
│   └── geo_utils.py
│
├── scoring/
│   ├── priority_engine.py
│   └── scoring_rules.py
│
├── recommendations/
│   ├── recommendation_engine.py
│   └── templates.py
│
├── models/
│   └── intelligence.py
│
└── tests/
Cluster Breakdown

Instead of building FP-3.2 as one large task, we will split it into independent engineering clusters.

Cluster IE-1
Classification Engine

Input

{
  "summary": "...",
  "category": "...",
  "themes": [...]
}

Output

{
  "primaryCategory": "Roads",
  "secondaryCategory": "Safety",
  "confidence": 0.94
}
Cluster IE-2
Theme Engine

Normalize AI themes.

Instead of

Road

Roads

Street

Road Repair

Road Issue

produce

Road Infrastructure

Create

taxonomy.py

with standardized government themes.

Cluster IE-3
Duplicate Detection

Do not use embeddings yet.

Use heuristic similarity.

Compare

summary
category
locality

Output

{
  "duplicate": true,
  "duplicateOf": "...",
  "similarity": 0.88
}

Later this module can be replaced with embeddings without changing the interface.

Cluster IE-4
Hotspot Detection

Group issues by

Locality

Ward

Coordinates

Output

{
  "hotspot": true,
  "issueCount": 19
}
Cluster IE-5
Priority Engine

Instead of asking Gemini,

compute a score.

Example

Priority

=

Severity

+

Frequency

+

Hotspot

+

Confidence

Output

{
  "priorityScore": 86,
  "priorityLevel": "HIGH"
}

This makes the system explainable.

Cluster IE-6
Recommendation Engine

Generate structured recommendations.

Example

{
  "action": "Repair damaged road",

  "department": "Public Works",

  "urgency": "Immediate",

  "reason": "High frequency and safety impact"
}
Intelligence Model

Create

backend/app/ai/intelligence/models/intelligence.py
class IntelligenceResult:

    submissionId

    category

    normalizedThemes

    duplicate

    hotspot

    priorityScore

    priorityLevel

    recommendation

    reasoning

    generatedAt
Repository

Create

backend/app/ai/intelligence/repositories/

base_intelligence_repository.py

intelligence_repository.py

Store in

intelligence/

Firestore collection.

Keep analysis/ and intelligence/ separate.

Intelligence State Machine
ANALYZED

↓

CLASSIFIED

↓

THEMES_NORMALIZED

↓

DUPLICATE_CHECKED

↓

HOTSPOT_DETECTED

↓

SCORED

↓

RECOMMENDED

↓

COMPLETED

Persist every transition.

API

Create

POST

/api/v1/intelligence/submissions/{submissionId}

Returns

{
  "success": true,
  "status": "completed",
  "intelligenceId": "...",
  "priorityScore": 86
}
Acceptance Criteria
 Classification engine
 Theme normalization
 Duplicate detector
 Hotspot detector
 Priority engine
 Recommendation engine
 Intelligence repository
 API endpoint
 Tests
 Build passes
Git Commit
feat(ai): implement intelligence engine