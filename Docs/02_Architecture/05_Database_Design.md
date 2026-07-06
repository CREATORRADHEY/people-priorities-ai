📄 05_Database_Design.md
Purpose

This document defines the logical and physical database architecture for People's Priorities AI.

It specifies:

Data ownership
Collections
Relationships
Indexes
Storage strategy
Versioning
Query patterns

This is NOT a Firestore tutorial.

It is the database blueprint.

1. Database Philosophy

The database stores business truth, not application state.

Rules:

Every collection maps to exactly one canonical object.
Collections never contain mixed responsibilities.
Raw data is immutable.
Derived objects are stored separately.
AI outputs are never mixed with citizen inputs.
2. Storage Architecture

We actually have four different storage systems.

                Storage Layer

        ┌────────────────────┐
        │    Firestore       │
        └────────────────────┘

        ┌────────────────────┐
        │ Firebase Storage   │
        └────────────────────┘

        ┌────────────────────┐
        │ ChromaDB           │
        └────────────────────┘

        ┌────────────────────┐
        │ BigQuery           │
        └────────────────────┘

Notice

Not everything belongs in Firestore.

Firestore

Purpose

Operational Database

Stores

CitizenSubmission

StructuredIssue

IssueCluster

EvidenceObject

PriorityAssessment

DecisionBrief
Firebase Storage

Stores

Images

Voice Files

Documents

Never binary data inside Firestore.

ChromaDB

Stores

Embeddings

Similarity Index

Cluster Index

Nothing else.

BigQuery

Stores

Census

Infrastructure

Public Datasets

Government Plans

Analytics

Think of it as the warehouse.

3. Firestore Collections
citizen_submissions

structured_issues

issue_clusters

evidence_objects

priority_assessments

decision_briefs

Exactly six.

Nothing more for MVP.

4. Collection Ownership
Collection	Owner
citizen_submissions	Submission Service
structured_issues	Understanding Service
issue_clusters	Issue Intelligence
evidence_objects	Evidence Engine
priority_assessments	Priority Engine
decision_briefs	Recommendation Engine

No shared ownership.

5. Relationships
CitizenSubmission

1

↓

StructuredIssue

N

↓

IssueCluster

1

↓

EvidenceObject

1

↓

PriorityAssessment

1

↓

DecisionBrief
6. Query Philosophy

Design queries first.

Never tables first.

Example

Dashboard asks

Top Priority Projects

Need

priority_assessments

NOT

CitizenSubmission

Citizen screen

Needs

Submission Status

Therefore

Query

citizen_submissions

Always design from queries.

7. Firestore Indexes

Need indexes for

timestamp

category

priority

ward

clusterId

submissionId

Composite indexes

ward + priority

category + timestamp

priority + createdAt
8. Data Lifecycle
CitizenSubmission

↓

Forever

StructuredIssue

↓

Forever

IssueCluster

↓

Updates

EvidenceObject

↓

Regenerated

PriorityAssessment

↓

Recomputed

DecisionBrief

↓

Regenerated

Notice

Only raw submissions are permanent.

Everything else is derived.

9. Storage Rules

Rule 1

Never overwrite submissions.

Rule 2

Never delete evidence.

Rule 3

Never duplicate objects.

Rule 4

Store references.

Not copies.

10. Naming Convention

Collections

snake_case

citizen_submissions

Document IDs

UUID

Fields

camelCase

submissionId
createdAt
priorityScore
11. Versioning

Every document

schemaVersion

createdAt

updatedAt

Mandatory.

12. Future Database Evolution

Production

Firestore

↓

BigQuery Streaming

↓

Analytics

↓

Vertex AI

↓

Decision Models

Easy migration.

Database Checklist

Before adding a collection

Ask

Does this represent a business object?
Who owns it?
Is another collection already responsible?
Is this operational or analytical data?
Should it be immutable?

If unclear

Don't create the collection.