# System Architecture Manual

This document details the high-level, component, and database architectures of the **People's Priorities AI** platform.

---

## 1. High-Level Architecture Flow

The system uses a vertical slice design pattern. Citizen reports flow through stateless controllers into Firestore, which triggers the AI pipeline and intelligence engines to produce decision structures displayed on the Member of Parliament (MP) portal.

```mermaid
graph TD
    Citizen["Citizen Grievance (🎙️/📷/✍️)"] -->|Submit| API["FastAPI Gateway"]
    API -->|1. Store Raw Data| DB[("Firestore: Submissions")]
    API -->|2. Store Media Assets| Storage[("Firebase Storage")]
    DB -->|Trigger Process| AIPipeline["Two-Stage AI Pipeline"]
    AIPipeline -->|Store Analysis| DB_Analysis[("Firestore: Analysis")]
    DB_Analysis -->|Trigger Intelligence| IntelEngine["Deterministic Intelligence Engine"]
    IntelEngine -->|Store Intelligence| DB_Intel[("Firestore: Intelligence")]
    DB_Intel & DB & DB_Analysis -->|Optimized Batched Query| Portal["Decision Intelligence Portal"]
```

---

## 2. AI Translation & Reasoning Pipeline

The AI pipeline isolates generative AI calls, using a shared state context to record state transitions and collect cost metrics.

```mermaid
graph TD
    Start["New Submission Document"] --> Init["Initialize PipelineContext"]
    Init --> State1["Update State: RECEIVED"]
    State1 --> PromptLoad["Prompt Loader (Read manifest.json)"]
    PromptLoad --> PromptBuild["Prompt Builder (Inject variables)"]
    PromptBuild --> Stage1["Stage 1: Normalize & Translate (gemini-2.5-flash)"]
    Stage1 --> State2["Update State: TRANSLATING"]
    Stage1 --> Stage2["Stage 2: Category & Theme Reason (Configured GEMINI_MODEL)"]
    Stage2 --> State3["Update State: ANALYZING"]
    Stage2 --> Parse["Parse & Validate JSON Schema"]
    Parse --> ModelCheck["Pydantic Schema Validation"]
    ModelCheck --> Success["Update State: COMPLETED"]
    ModelCheck -->|Failure| Fail["Update State: FAILED"]
    Success & Fail --> WriteDB[("Firestore: Analysis")]
```

---

## 3. Decision Portal & Dashboard Widget Flow

Every widget inside the Member of Parliament Dashboard is isolated, wrapping itself in an independent Error Boundary and managing its own lifecycle.

```mermaid
graph TD
    Dashboard["MP Dashboard Page"] --> Overview["ExecutiveOverview Card Widget"]
    Dashboard --> Queue["PriorityQueue Table Widget"]
    Dashboard --> Hotspots["HotspotList Progress Widget"]
    Dashboard --> Recs["Recommendation Center Widget"]
    Dashboard --> Review["ReviewQueue Alerts Widget"]
    Dashboard --> Explorer["SubmissionExplorer Drawer Widget"]

    %% Error boundaries
    Overview -.->|Wrap| EB1["ErrorBoundary"]
    Queue -.->|Wrap| EB2["ErrorBoundary"]
    Hotspots -.->|Wrap| EB3["ErrorBoundary"]
    Recs -.->|Wrap| EB4["ErrorBoundary"]
    Review -.->|Wrap| EB5["ErrorBoundary"]
    Explorer -.->|Wrap| EB6["ErrorBoundary"]

    %% Data hook
    useHook["useDashboardData Hook"] -->|Fetch Aggregates| Overview
    useHook -->|Priorities & Sorting| Queue
    useHook -->|Locality Thresholds| Hotspots
    useHook -->|Department Grouping| Recs
    useHook -->|Low Confidence Flags| Review
    useHook -->|Get Complete Audit Lineage| Explorer
```

---

## 4. Repository Directory Structure

```
people-priorities-ai/
├── Docs/                    # Architecture Specs & Developer Guides
│   ├── screenshots/         # Captured PNG user interfaces
│   ├── Architecture.md      # This file
│   ├── AI_PIPELINE.md       # AI Analysis manual
│   ├── API_REFERENCE.md     # REST contract docs
│   └── DEPLOYMENT.md        # Environment setup guide
├── backend/                 # FastAPI Backend Service
│   ├── app/
│   │   ├── api/             # API Controllers & routing
│   │   ├── core/            # Config, logger, policy rules
│   │   ├── db/              # Database drivers
│   │   ├── ai/              # Prompt versioning & Gateway
│   │   ├── models/          # Core DB structure maps
│   │   ├── schemas/         # Request/response validators
│   │   ├── repositories/    # Query abstraction wrappers
│   │   └── services/        # Orchestrator flows
│   └── requirements.txt     # Python dependencies
├── frontend/                # React Frontend Service
│   ├── src/
│   │   ├── features/        # Feature slices (dashboard, submission)
│   │   ├── components/      # Common UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── services/        # Axios API clients
│   └── package.json         # Node.js dependencies
└── shared/                  # Shared JSON validation files
```
