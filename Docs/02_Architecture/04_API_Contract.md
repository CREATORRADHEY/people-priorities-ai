📄 04_API_Contract.md

Project: People's Priorities AI

Version: 1.0

Status: Draft → Review → Locked

Owner: Backend Engineering Team

1. Purpose

This document defines the official API specification for the People's Priorities AI platform.

Every frontend component, AI service, and backend module must communicate exclusively through these contracts.

This document is the authoritative source for:

Endpoint definitions
Request formats
Response formats
Validation rules
Error handling
Versioning
Naming conventions

No API should be implemented unless defined here.

2. API Design Principles
AP-001 Resource-Oriented Design

Every endpoint represents a business resource, not an action.

✅ Good

POST /submissions
GET /issue-clusters
GET /decision-briefs

❌ Bad

POST /submitComplaint
POST /runGemini
POST /calculatePriority
AP-002 Stateless Requests

Every request must contain everything required for execution.

No server-side session state.

AP-003 Predictable Responses

Every endpoint returns a consistent response envelope.

AP-004 Versioning

All APIs begin with

/api/v1/

Future versions

/api/v2/
3. API Resource Model
Submissions

↓

Structured Issues

↓

Issue Clusters

↓

Evidence Objects

↓

Priority Assessments

↓

Decision Briefs

Each resource maps directly to one canonical object.

4. Endpoint Catalogue
Submission APIs
Create Submission
POST /api/v1/submissions

Purpose

Create a CitizenSubmission.

Get Submission
GET /api/v1/submissions/{id}
List Submissions
GET /api/v1/submissions
AI Understanding
Generate Structured Issue
POST /api/v1/submissions/{id}/understand

Returns

StructuredIssue

Retrieve Structured Issue
GET /api/v1/structured-issues/{id}
Issue Intelligence
Create Cluster
POST /api/v1/issue-clusters
Retrieve Cluster
GET /api/v1/issue-clusters/{id}
Evidence Engine
Generate Evidence
POST /api/v1/issue-clusters/{id}/evidence
Get Evidence
GET /api/v1/evidence/{id}
Priority Engine
Calculate Priority
POST /api/v1/evidence/{id}/priority
Retrieve Priority
GET /api/v1/priorities/{id}
Recommendation Engine
Generate Decision Brief
POST /api/v1/priorities/{id}/decision-brief
Retrieve Decision Brief
GET /api/v1/decision-briefs/{id}
Dashboard
Dashboard Summary
GET /api/v1/dashboard
Dashboard Heatmap
GET /api/v1/dashboard/heatmap
Dashboard Priorities
GET /api/v1/dashboard/priorities
5. Standard Request Envelope
{
  "data": {},
  "metadata": {}
}
6. Standard Success Response
{
  "success": true,
  "message": "Submission created successfully.",
  "data": {},
  "metadata": {
    "requestId": "...",
    "timestamp": "...",
    "processingTimeMs": 231
  }
}
7. Standard Error Response
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Latitude is required.",
    "details": {}
  },
  "metadata": {
    "requestId": "...",
    "timestamp": "..."
  }
}
8. HTTP Status Codes
Code	Meaning
200	Success
201	Created
400	Validation Error
401	Unauthorized
403	Forbidden
404	Resource Not Found
409	Conflict
422	Invalid AI Output
429	Rate Limited
500	Internal Error
503	External Service Unavailable
9. Validation Rules

Every endpoint must:

Validate schema.
Validate required fields.
Validate enum values.
Validate coordinates.
Reject malformed payloads.
Log validation failures.
10. Idempotency

Safe to retry:

GET requests
AI generation using existing IDs (should reuse previous results if already generated)

Creation endpoints should support an Idempotency-Key header in future production versions.

11. Logging

Every request logs:

Request ID
Correlation ID
Endpoint
Processing time
AI latency (if applicable)
Response status
12. API Ownership
Endpoint Group	Owner
/submissions	Submission Service
/structured-issues	Understanding Service
/issue-clusters	Issue Intelligence
/evidence	Evidence Engine
/priorities	Priority Engine
/decision-briefs	Recommendation Engine
/dashboard	Dashboard Service
13. Future API Extensions

Reserved resources:

/notifications
/users
/departments
/reports
/analytics
/citizens

These are intentionally excluded from the MVP.