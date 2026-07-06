📄 02_Engineering_Principles.md

Project: People's Priorities AI

Version: 1.0

Status: Draft → Review → Locked

Owner: Engineering Team

1. Purpose

This document defines the engineering principles, standards, and development philosophy for the People's Priorities AI platform.

These principles are mandatory for every:

Feature
API
Service
Database
AI Prompt
UI Component
Test
Pull Request

If a design violates these principles, it must be redesigned before implementation.

2. Engineering Philosophy

Our goal is not to build software.

Our goal is to build a maintainable, explainable, production-ready AI system.

Every decision must maximize:

Simplicity
Explainability
Modularity
Testability
Scalability
3. Core Engineering Principles
EP-001
Vertical Slice Development

Every feature is built from UI to database before starting the next feature.

UI
↓
API
↓
Business Logic
↓
AI
↓
Database
↓
Testing

❌ Never build all APIs first.

❌ Never build all frontend first.

✅ Build complete slices.

EP-002
One Responsibility Per Service

Every service owns exactly one business capability.

Example

Submission Service

ONLY handles submissions.

Not

Submission + AI + Dashboard
EP-003
Pipeline-Based Development

Every cluster is a pipeline.

Example

Citizen Submission

↓

Structured Issue

↓

Issue Cluster

↓

Evidence

↓

Priority

↓

Decision Brief

Pipelines communicate through well-defined objects.

EP-004
Immutable Objects

Once created

CitizenSubmission

never changes.

Instead

New objects are created.

CitizenSubmission

↓

StructuredIssue

↓

IssueCluster

Never overwrite previous stages.

EP-005
AI Is a Service

AI never lives inside controllers.

Correct

Controller

↓

AI Service

↓

Gemini

Wrong

Controller

↓

Huge Prompt

↓

Return Response
EP-006
Explainability First

Every AI recommendation must answer

Why?

Evidence?

Confidence?

Supporting data?

Alternative options?

No black-box outputs.

EP-007
Deterministic Before AI

Before using AI ask

Can software solve this?

If yes

Don't use AI.

Examples

Sorting

Filtering

Scoring

Ranking

Validation

These remain deterministic.

EP-008
AI For Understanding, Not Authority

AI may

Understand

Summarize

Explain

Recommend

AI may NOT

Approve

Allocate funds

Replace MP decisions

EP-009
Evidence Before Recommendation

Recommendations cannot exist without evidence.

Every recommendation references:

citizen demand
infrastructure gap
public datasets
location
impact
EP-010
Data Flows Forward

Data never moves backwards.

CitizenSubmission

↓

StructuredIssue

↓

IssueCluster

↓

Evidence

↓

Priority

↓

DecisionBrief

No circular dependencies.

4. Software Architecture Principles
AP-001

Stateless APIs

Every request is independent.

AP-002

Single Source of Truth

Every object has one owner.

AP-003

Loose Coupling

Services communicate only through contracts.

Never internal implementation.

AP-004

High Cohesion

Everything inside a service should belong together.

AP-005

Dependency Direction

Dependencies always point downward.

Frontend

↓

API

↓

Service

↓

Repository

Never reverse.

5. Coding Principles
CP-001

Readable > Clever

Code should be understandable by a new engineer.

CP-002

Functions Do One Thing

Maximum responsibility:

One.

CP-003

Small Files

Prefer many focused files.

Avoid giant files.

CP-004

Explicit Types

Every API uses typed request/response models.

CP-005

No Magic Values

Constants belong in configuration.

6. API Principles

Every endpoint must

Validate input
Return typed responses
Handle errors gracefully
Log requests
Be idempotent where appropriate

Naming

POST /submission

POST /cluster

GET /dashboard

Simple.

Consistent.

7. Database Principles

Collections mirror business objects.

CitizenSubmission

StructuredIssue

IssueCluster

EvidenceObject

PriorityAssessment

DecisionBrief

Never create generic collections like

data

info

misc

temp
8. AI Principles

Every AI service must define

Prompt Version
Model
Temperature
Expected Output Schema
Validation
Retry Strategy
Fallback Strategy

AI outputs are never trusted without validation.

9. Documentation Principles

Every cluster must include

Objective
Inputs
Outputs
APIs
Data Models
Tests
Definition of Done

Documentation is updated before merging.

10. Testing Principles

Every cluster passes

Unit Tests
Integration Tests
End-to-End Tests

No feature is complete without tests.

11. Git Principles

One branch per cluster.

feature/cluster-1

feature/cluster-2

Merge only after:

Code review
Tests pass
Documentation updated
12. Definition of Done

A cluster is complete only if:

Feature works end-to-end
APIs documented
AI prompt documented
Database updated
Tests pass
Documentation updated
Demo successful
13. Engineering Checklist

Before writing code ask:

Does this belong in this service?
Can this be tested independently?
Is AI actually required?
Can another engineer understand this?
Does it follow the pipeline?
Is every output explainable?

If any answer is No, redesign first.

14. Engineering Mantras

These become our daily rules.

Build vertically, not horizontally.
AI is a collaborator, not the decision-maker.
Evidence before intelligence.
One service. One responsibility.
Test every cluster.
Documentation is part of the product.
Code should explain itself.
Every recommendation must be explainable.
Small modules beat giant systems.
Finish one pipeline before starting another.
15. Final Engineering Rule

If a feature cannot be built, tested, documented, and demonstrated independently, it is too large and must be decomposed into smaller engineering units.