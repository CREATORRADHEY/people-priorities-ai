📦 Feature Pack FP-2.4
Frontend ↔ Backend Integration

Sprint: 2
Priority: P0 (Highest)
Estimated Time: 4–6 Hours

Dependencies

FP-2.1 ✅
FP-2.2 ✅
FP-2.3 ✅
Objective

Replace every mock workflow with a real backend integration.

After FP-2.4, a citizen should be able to:

Open App

↓

Fill Form

↓

Record Voice

↓

Upload Images

↓

Capture Location

↓

Review

↓

Submit

↓

Backend

↓

Firestore

↓

Storage

↓

Success

This is your first complete vertical slice.

Scope
✅ Implement
API client layer
Submission API integration
Media upload API integration
Loading states
Error handling
Retry mechanism
Success page with real Submission ID
Draft cleanup after successful submission
❌ Do NOT Implement
AI analysis
Admin dashboard
Authentication
Push notifications
Architecture
React Wizard
      │
      ▼
SubmissionService (Frontend)
      │
      ▼
POST /api/v1/submissions
      │
      ▼
submissionId
      │
      ▼
POST /submissions/{id}/media
      │
      ▼
Success
Folder Changes
frontend/src/

services/

    api/

        apiClient.ts

        submissionApi.ts

        mediaApi.ts

features/

submission/

    hooks/

        useSubmissionWorkflow.ts

    services/

        submissionWorkflow.ts

    types/

        api.ts
Step 1
API Client

Create

apiClient.ts

Responsibilities

Axios instance
Base URL
Timeout
Error interceptor
Request logging
Step 2

Submission API

submissionApi.ts

Methods

createSubmission()

uploadMedia()

getSubmission()
Step 3

Workflow Service

This becomes the orchestrator.

Submission Draft

↓

POST metadata

↓

submissionId

↓

Upload voice

↓

Upload images

↓

Return Success

No React code inside.

Pure TypeScript.

Step 4

React Hook

useSubmissionWorkflow()

Responsibilities

loading
progress
retry
cancel
errors
success
Step 5

Review Page

Replace

Mock Submit

with

Real API Call
Step 6

Success Page

Instead of

Prototype Complete

Show

Submission Received

Submission ID

SUB-XXXXXX

Status

RECEIVED
Error Handling

Cases

API Down

↓

Retry
Upload Failed

↓

Retry Upload
Network Lost

↓

Keep Draft
Validation Error

↓

Return User
Progress Flow
Submitting...

↓

Creating Submission

↓

Uploading Voice

↓

Uploading Images

↓

Finalizing

↓

Done

This gives an excellent UX during uploads.

Acceptance Criteria
 React calls backend
 Submission created
 Media uploaded
 Firestore updated
 Success page shows real submissionId
 Draft cleared
 Retry works
 Build passes
Git Commit
feat(integration): connect frontend to backend