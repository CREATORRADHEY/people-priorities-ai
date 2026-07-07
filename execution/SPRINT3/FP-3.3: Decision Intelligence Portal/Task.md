📦 Feature Pack FP-3.3
Decision Intelligence Portal (MP Dashboard)

Sprint: 3
Priority: P0
Estimated Time: 8-10 Hours

Dependencies

FP-3.1 ✅ AI Analysis Pipeline
FP-3.2 ✅ Intelligence Engine
Objective

Provide Members of Parliament with an explainable, actionable, and data-driven view of citizen issues.

The dashboard should answer:

What should I fix first?
Where are the biggest problems?
Why is this important?
Which issues are duplicates?
Which submissions need human review?
Scope
✅ Implement
Dashboard shell
Executive overview
Priority queue
Hotspot map
Duplicate clusters
Human review queue
Submission explorer
Recommendation center
❌ Do NOT Implement
Authentication
Notifications
Live updates
Analytics exports
Role management
Overall Architecture
Decision Intelligence Portal
        │
        ├──────────────┐
        ▼              ▼
Dashboard Shell    Shared Layout
        │
        ▼
──────────────────────────────────
Executive Overview
──────────────────────────────────
Priority Queue
──────────────────────────────────
Hotspot Map
──────────────────────────────────
Duplicate Clusters
──────────────────────────────────
Recommendation Center
──────────────────────────────────
Human Review Queue
──────────────────────────────────
Submission Explorer
Dashboard Folder Structure
frontend/src/features/dashboard/

├── shell/
│
├── overview/
│
├── priority/
│
├── hotspots/
│
├── duplicates/
│
├── recommendations/
│
├── review/
│
├── explorer/
│
├── services/
│
├── hooks/
│
├── types/
│
└── tests/
Break FP-3.3 Into Independent UI Clusters

Just like Sprint 3 backend, we will build the frontend as bounded systems.

Cluster UI-1
Dashboard Shell

Responsible only for

Layout

↓

Sidebar

↓

Top Navigation

↓

Routing

↓

Theme

Nothing else.

Cluster UI-2
Executive Overview

Cards

Total Issues

High Priority

Critical Issues

Hotspots

Pending Reviews

These are summaries only.

No tables.

Cluster UI-3
Priority Queue

The most important module.

Table

Priority

↓

Issue

↓

Location

↓

Category

↓

Score

↓

Recommendation

Sorted by

Priority Score DESC
Cluster UI-4
Hotspot Map

Initially

No Google Maps.

Instead

Ward

↓

Issue Count

↓

Top Category

A simple list is sufficient for the hackathon.

Maps can be a later enhancement.

Cluster UI-5
Duplicate Clusters

Example

Road Damage

↓

17 Reports

↓

Merged Cluster

Allow expanding the cluster to inspect related submissions.

Cluster UI-6
Recommendation Center

Display structured recommendations.

Example

Action

Repair Street Lights

Department

PWD

Urgency

Immediate

Reason

High hotspot activity

These come directly from FP-3.2.

Cluster UI-7
Human Review Queue

Only display

reviewRequired == true

These are the submissions needing manual verification.

Cluster UI-8
Submission Explorer

Complete submission details.

Display

Submission

↓

AI Analysis

↓

Intelligence

↓

Recommendation

This is the "explainability" screen.

API Layer

Create

frontend/src/features/dashboard/services/

dashboardApi.ts

Methods

getDashboardSummary()

getPriorityQueue()

getHotspots()

getDuplicateClusters()

getRecommendations()

getReviewQueue()

getSubmission()
Backend APIs

Expose

GET /api/v1/dashboard/summary

GET /api/v1/dashboard/priorities

GET /api/v1/dashboard/hotspots

GET /api/v1/dashboard/recommendations

GET /api/v1/dashboard/review

GET /api/v1/dashboard/submissions/{id}

Keep them read-only.

Shared Dashboard Model
DashboardState

↓

summary

priorities

hotspots

duplicates

recommendations

reviewQueue

selectedSubmission
Acceptance Criteria
 Dashboard shell
 Executive overview
 Priority queue
 Hotspot view
 Duplicate clusters
 Recommendation center
 Human review queue
 Submission explorer
 Backend APIs
 Build passes
Git Commit
feat(dashboard): implement decision intelligence portal