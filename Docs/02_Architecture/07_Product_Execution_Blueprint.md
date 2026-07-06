Version: 1.0
Status: Master Execution Plan
Owner: Engineering Team

Purpose

This document defines how the team executes the project.

It bridges the gap between architecture and implementation.

After this document, no planning should remain.

The project enters Execution Mode.

Engineering Hierarchy

This is now our permanent hierarchy.

Project
│
├── Capability
│     ├── Pipeline
│     │      ├── Feature Pack
│     │      │      ├── Feature
│     │      │      │      └── Engineering Tasks

Everything in the repository belongs somewhere in this hierarchy.

Capability Map
Capability 1
Citizen Participation

Purpose

Collect authentic citizen feedback.

Pipelines

Submission Pipeline

Status Pipeline
Capability 2
AI Understanding

Purpose

Transform raw input into structured knowledge.

Pipelines

Speech Understanding

Text Understanding

Vision Understanding

Issue Structuring
Capability 3
Community Intelligence

Purpose

Find recurring public needs.

Pipelines

Embedding Pipeline

Duplicate Detection

Issue Clustering
Capability 4
Evidence Intelligence

Purpose

Attach facts.

Pipelines

Maps

Infrastructure

Population

Government Data
Capability 5
Decision Intelligence

Purpose

Prioritize.

Pipelines

Priority Engine

Decision Brief
Capability 6
Visualization

Purpose

Present insights.

Pipelines

Dashboard

Maps

Reports
Sprint Planning

Instead of coding randomly, we'll execute in four sprints.

Sprint 1
Goal

Citizen can submit an issue.

Deliverables

Project Foundation

Landing Page

Submission Form

Voice Upload

Image Upload

Location Capture

Submission API

Firestore Save

Demo

Citizen submits an issue successfully.

Sprint 2

Goal

AI understands citizen input.

Deliverables

Speech Understanding

Image Analysis

StructuredIssue

Embeddings

Duplicate Detection

Demo

Multiple complaints become structured issues and similar reports are grouped.

Sprint 3

Goal

Transform clustered issues into recommendations.

Deliverables

Evidence Engine

Priority Engine

Decision Brief

Demo

One issue receives a complete, explainable recommendation.

Sprint 4

Goal

Complete MP experience.

Deliverables

Dashboard

Heatmap

Priority Cards

Evidence View

Decision Brief View

Demo

MP opens dashboard and sees ranked development priorities.

Feature Pack Template

Every Feature Pack follows this contract.

FP-ID

Objective

Dependencies

Inputs

Outputs

Files

Database

API

Frontend

Backend

AI

Testing

Definition of Done

Nothing is implemented without a Feature Pack.

Repository Mapping

Every Feature Pack maps to a folder.

frontend/src/features/

submission/

dashboard/

priority/

decision/

maps/

Backend mirrors the same ownership.

backend/app/features/

submission/

understanding/

clustering/

evidence/

priority/

dashboard/

Notice that frontend and backend use the same feature names.

That makes navigation almost effortless.

Git Strategy

We won't create generic branches.

We'll create Feature Pack branches.

feature/fp-1.1-landing-page

feature/fp-1.2-submission-form

feature/fp-1.3-voice-recorder

feature/fp-2.1-understanding-engine

Every branch merges independently.

Commit Strategy

Every commit should represent one completed engineering task.

Example

feat(submission): add multilingual submission form

feat(voice): integrate browser voice recorder

feat(api): create submission endpoint

feat(ai): generate structured issue

test(submission): add integration tests

No commits like:

final

fix

update

changes

done
Definition of Progress

We don't measure progress by lines of code.

We measure progress by completed Feature Packs.

Example

Sprint 1

FP-1.1 ✅

FP-1.2 ✅

FP-1.3 ⏳

FP-1.4 ⏳

This gives us a real project dashboard.

Demo Milestones

We should never wait until the end to see if the project works.

Every sprint ends with a demo.

Sprint	Demo
1	Citizen submits issue
2	AI understands and groups issues
3	AI generates decision brief
4	MP dashboard works end-to-end
Risk Register
Risk	Mitigation
Gemini JSON inconsistency	Schema validation + retry
Public datasets unavailable	Mock datasets for MVP
Maps integration delay	Use static coordinates first
Time constraints	Defer non-MVP features
Daily Working Rule

Every coding session follows the same sequence:

Choose Feature Pack

↓

Read SDD

↓

Implement

↓

Test

↓

Commit

↓

Merge

↓

Update Progress Board

↓

Next Feature Pack

No jumping between unrelated features.

Exit Criteria

The project is complete when:

All P0 Feature Packs are complete.
Every sprint demo succeeds.
All acceptance tests pass.
Documentation matches implementation.
The end-to-end flow works without manual intervention.