📦 Feature Pack FP-2.2
Firestore Persistence

Priority: P0

Estimated Time: 2-3 Hours

Dependencies

FP-2.1 ✅
Objective

Persist the validated SubmissionPayload into Firestore.

No file uploads yet.

Only metadata.

Scope
✅ Implement
Firestore Repository
Firestore Collection
Create Submission
Read Submission
Update Submission Status
Repository Pattern
Firestore Service Integration
❌ Do NOT Implement
Firebase Storage
Image Upload
Voice Upload
AI
Dashboard
Authentication
Firestore Structure
submissions/

    {submissionId}

        version

        requestId

        createdAt

        status

        information

        voice

        images

        location
Folder Changes
backend/app/

repositories/

    submission_repository.py

db/

    firestore.py

services/

    submission_service.py

(api updated)

tests/

    test_firestore_repository.py
Request Flow
POST

↓

Router

↓

Schema

↓

SubmissionService

↓

SubmissionRepository

↓

Firestore

↓

Return submissionId
Repository Responsibilities

Create

SubmissionRepository

Methods

create_submission()

get_submission()

update_status()

exists()

The service must never call Firestore directly.

Firestore Status

Only use

RECEIVED

Future statuses will come later.

Response

Instead of

{
  "status":"accepted"
}

Return

{
  "success":true,
  "requestId":"...",

  "status":"received",

  "data":{

      "submissionId":"abc123"

  }
}
Acceptance Criteria
 Firestore connects
 Repository implemented
 Submission saved
 Firestore document created
 submissionId returned
 Repository tests pass
 Build passes
Git Commit
feat(firestore): implement submission persistence