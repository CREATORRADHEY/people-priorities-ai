📄 03_Canonical_Data_Model.md

Project: People's Priorities AI

Version: 1.0

Status: Draft → Review → Locked

Owner: Backend + AI Team

1. Purpose

This document defines the canonical business objects that flow through the People's Priorities AI platform.

Every service communicates using these objects.

These objects are immutable, versionable, and serve as the single source of truth across the system.

2. Design Principles

The Canonical Data Model follows these rules:

Every object represents a business concept.
Objects are immutable after creation.
Objects evolve by enrichment, never by mutation.
Every object has one owner.
Every object has a unique lifecycle.
Every object maps to exactly one Firestore collection.
Every API accepts or returns canonical objects.
3. Object Lifecycle
CitizenSubmission
        │
        ▼
StructuredIssue
        │
        ▼
IssueCluster
        │
        ▼
EvidenceObject
        │
        ▼
PriorityAssessment
        │
        ▼
DecisionBrief

Each object adds intelligence.

No object modifies the previous one.

4. Canonical Objects
Object 1
CitizenSubmission
Purpose

Represents the original citizen input exactly as received.

This object is the immutable source of truth.

Owner

Submission Service

Lifecycle
Created

↓

Stored

↓

Consumed by AI

↓

Never Modified
Fields
Field	Type	Required
submissionId	UUID	✅
timestamp	DateTime	✅
inputType	Enum	✅
language	String	✅
rawText	String	Optional
voiceUrl	String	Optional
imageUrls	List	Optional
latitude	Double	✅
longitude	Double	✅
ward	String	Optional
metadata	Object	Optional
Validation
At least one of text, voice, or image must exist.
GPS must be available.
Input type must be valid.
Firestore Collection
citizen_submissions
Produced By

Submission Pipeline

Consumed By

Understanding Engine

Object 2
StructuredIssue
Purpose

Represents AI's understanding of one submission.

No reasoning.

Only interpretation.

Owner

Understanding Service

Lifecycle
CitizenSubmission

↓

Gemini

↓

StructuredIssue
Fields
Field	Type
issueId	UUID
submissionId	UUID
category	Enum
subCategory	Enum
summary	String
severity	Enum
confidence	Float
extractedEntities	List
location	GeoPoint
Validation

Confidence

0–1

Category

Required

Summary

Maximum 250 characters

Firestore
structured_issues
Produced By

AI Understanding Pipeline

Consumed By

Issue Intelligence Pipeline

Object 3
IssueCluster
Purpose

Represents one community problem.

Multiple submissions become one issue.

Owner

Issue Intelligence Service

Lifecycle
StructuredIssue

↓

Embedding

↓

Similarity

↓

Cluster
Fields
Field	Type
clusterId	UUID
title	String
category	String
issueIds	List
submissionCount	Integer
centroid	GeoPoint
heatScore	Float
Validation

Minimum

2 issues

Maximum

Unlimited

Firestore
issue_clusters
Produced By

Issue Intelligence

Consumed By

Evidence Engine

Object 4
EvidenceObject
Purpose

Represents every fact required for decision making.

No opinions.

No AI conclusions.

Only evidence.

Owner

Evidence Engine

Fields
Field	Type
clusterId	UUID
population	Integer
infrastructureGap	Float
nearestSchool	Object
nearestHospital	Object
governmentSchemes	List
citizenDemand	Integer
roadDistance	Float
supportingImages	List
Validation

Evidence must reference one cluster.

Firestore
evidence_objects
Produced By

Evidence Pipeline

Consumed By

Priority Engine

Object 5
PriorityAssessment
Purpose

Represents deterministic project ranking.

Owner

Priority Engine

Fields
Field	Type
assessmentId	UUID
clusterId	UUID
demandScore	Float
impactScore	Float
urgencyScore	Float
feasibilityScore	Float
finalPriority	Float
priorityLevel	Enum
Validation

Priority

0–100

Firestore
priority_assessments
Produced By

Priority Engine

Consumed By

Decision Engine

Object 6
DecisionBrief
Purpose

Final artifact shown to MPs.

Owner

Recommendation Service

Fields
Field	Type
briefId	UUID
clusterId	UUID
recommendation	String
reasoning	String
supportingEvidence	List
expectedImpact	String
confidence	Float
executiveSummary	String
Validation

Reasoning required.

Recommendation required.

Firestore
decision_briefs
Produced By

Recommendation Engine

Consumed By

Dashboard

5. Object Relationships
CitizenSubmission
      │
      │ 1:N
      ▼
StructuredIssue
      │
      │ N:1
      ▼
IssueCluster
      │
      │ 1:1
      ▼
EvidenceObject
      │
      │ 1:1
      ▼
PriorityAssessment
      │
      │ 1:1
      ▼
DecisionBrief
6. Ownership Matrix
Object	Owner
CitizenSubmission	Submission Service
StructuredIssue	Understanding Service
IssueCluster	Issue Intelligence
EvidenceObject	Evidence Engine
PriorityAssessment	Priority Engine
DecisionBrief	Recommendation Engine
7. Object Evolution Rules

Allowed

CitizenSubmission

↓

StructuredIssue

Allowed

IssueCluster

↓

EvidenceObject

Not Allowed

DecisionBrief

↓

CitizenSubmission

No reverse flow.

8. Versioning

Every object includes

{
  "schemaVersion": "1.0"
}

Future updates create new versions without breaking compatibility.

9. Serialization Rules
UUIDs stored as strings.
Timestamps in ISO-8601 UTC.
Geo locations stored as Firestore GeoPoint.
Enums serialized as strings.
Null values omitted where possible.
10. Engineering Rules

Developers must never:

Skip an object.
Modify previous objects.
Merge object responsibilities.
Add fields without updating this document.

All changes require updating the Canonical Data Model first.