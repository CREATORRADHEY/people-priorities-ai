📄 01_Product_Requirements.md

Project: People's Priorities AI
Version: 1.0
Status: Draft → Review → Locked
Owner: Product & Engineering Team

1. Purpose

This Product Requirements Document (PRD) defines the functional, technical, and business requirements for the People's Priorities AI platform.

It serves as the single source of truth between Product, Design, AI Engineering, Backend, Frontend, and QA teams.

2. Product Overview

People's Priorities AI is an AI-powered decision intelligence platform that transforms multilingual citizen feedback into evidence-backed development recommendations for Members of Parliament and constituency planning teams.

The platform combines:

Citizen submissions
AI understanding
Public datasets
Geospatial information
Infrastructure data
Explainable decision intelligence
3. Product Goals

The MVP must successfully demonstrate:

End-to-end citizen submission
AI understanding of multimodal inputs
Community issue detection
Public data enrichment
Evidence-based prioritization
Explainable recommendations
MP decision dashboard
4. Success Criteria

The product is successful when an MP can answer:

What should I prioritize?
Why should I prioritize it?
What evidence supports this recommendation?
Where is this issue located?
How many people benefit?
5. Stakeholders
Primary
Member of Parliament
MP Office Staff
Secondary
Citizens
District Officials
Government Departments
6. User Personas
Persona 1
Citizen

Goal

Report a local issue easily.

Pain

Doesn't know whether anyone is listening.

Success

Issue reaches planning system.

Persona 2
MP Staff

Goal

Process hundreds of requests efficiently.

Pain

Manual sorting and duplication.

Success

AI automatically organizes requests.

Persona 3
Member of Parliament

Goal

Allocate limited development funds effectively.

Pain

Too many competing priorities.

Success

Receives evidence-backed recommendations.

7. User Stories
Citizen Stories
US-001

As a citizen,

I want to submit an issue using text,

so that I can report development problems.

US-002

As a citizen,

I want to upload photos,

so that AI can understand the problem visually.

US-003

As a citizen,

I want to record my voice,

so that I can communicate in my preferred language.

US-004

As a citizen,

I want my location captured,

so that the issue is mapped accurately.

MP Office Stories
US-005

As an MP office staff member,

I want duplicate complaints grouped,

so that manual work is reduced.

US-006

I want recurring issues identified,

so that community problems become visible.

US-007

I want issues categorized automatically,

so that no manual tagging is required.

MP Stories
US-008

As an MP,

I want the highest-priority projects displayed,

so that I can allocate funds effectively.

US-009

I want AI explanations,

so that recommendations are transparent.

US-010

I want evidence supporting every recommendation,

so that decisions can be justified.

8. Functional Requirements
Citizen Intake
FR-001

System shall allow text submissions.

FR-002

System shall allow voice submissions.

FR-003

System shall allow image uploads.

FR-004

System shall capture location.

FR-005

System shall store raw submissions.

AI Understanding
FR-006

System shall convert voice to text.

FR-007

System shall analyze uploaded images.

FR-008

System shall detect language.

FR-009

System shall generate structured issue JSON.

FR-010

System shall assign confidence score.

Issue Intelligence
FR-011

System shall create embeddings.

FR-012

System shall detect duplicate issues.

FR-013

System shall cluster related issues.

FR-014

System shall generate community issue objects.

Evidence Engine
FR-015

System shall retrieve public datasets.

FR-016

System shall calculate infrastructure gaps.

FR-017

System shall enrich issue clusters.

Decision Engine
FR-018

System shall calculate priority scores.

FR-019

System shall rank issues.

FR-020

System shall generate decision briefs.

Dashboard
FR-021

System shall display ranked issues.

FR-022

System shall display supporting evidence.

FR-023

System shall display map visualizations.

FR-024

System shall display AI explanations.

9. Non-Functional Requirements
Performance
Submission < 3 sec
AI processing < 15 sec
Dashboard load < 3 sec
Scalability

Support future constituency-scale deployments.

Reliability

Graceful AI failure handling.

Security

Secure API keys.

Input validation.

HTTPS only.

Accessibility

Voice-first.

Multilingual.

Mobile responsive.

10. MVP Scope
Must Have

✅ Text

✅ Voice

✅ Images

✅ Gemini

✅ Firestore

✅ Priority Engine

✅ Dashboard

Should Have
Google Maps
Heatmaps
Public datasets
Could Have
WhatsApp
SMS
Notifications
Won't Have (Hackathon)
ERP Integration
Authentication
Workflow approvals
Budget management
Predictive analytics
11. Out of Scope
Project execution
Contractor tracking
Fund disbursement
Procurement
Election analytics
12. Feature Prioritization
Priority	Features
P0	Submission, AI Understanding, Priority Engine, Dashboard
P1	Clustering, Evidence Engine
P2	Maps, Heatmaps
P3	Notifications
13. Traceability Matrix
Cluster	Features
Cluster 0	Foundation
Cluster 1	Citizen Intake
Cluster 2	AI Understanding
Cluster 3	Issue Intelligence
Cluster 4	Evidence Engine
Cluster 5	Decision Engine
Cluster 6	Dashboard
14. Acceptance Criteria

The MVP is accepted when:

A citizen submits voice/text/image.
AI generates a StructuredIssue.
Similar issues are grouped.
Evidence is attached.
Priority score is calculated.
Decision Brief is generated.
Dashboard displays ranked recommendations.
15. Risks
Technical
Gemini JSON inconsistency
Public dataset quality
API latency
Product
Limited demo data
Mocked datasets for MVP
AI confidence interpretation
16. Assumptions
Public datasets are available or can be mocked.
Citizens grant location access.
Google Cloud services are available.
Gemini API is accessible during the hackathon.
17. Open Questions

These will be resolved during implementation:

Should issue clustering run synchronously or asynchronously?
What is the minimum number of reports before creating an IssueCluster?
How should conflicting evidence affect the priority score?
Should confidence be displayed to MPs or kept internal?