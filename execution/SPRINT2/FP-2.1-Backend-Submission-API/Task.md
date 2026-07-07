# 📦 Feature Pack FP-2.1

# Backend Submission API

---

## Status

Ready

Priority: P0

Estimated Time: 2–3 Hours

Dependencies:

- Sprint 1 Complete
- BAD-01 Approved

---

# Objective

Implement the first production-style backend endpoint that accepts a validated citizen submission.

This Feature Pack introduces the backend request lifecycle but does **not** persist any data.

---

# Scope

## Included

- FastAPI POST endpoint
- Request schema
- Response schema
- Pydantic validation
- Structured logging
- Request ID generation
- Submission service
- Swagger documentation
- Unit tests

---

## Excluded

- Firestore
- Firebase Storage
- Gemini
- Authentication
- Background jobs
- AI processing

---

# API

## Endpoint

POST /api/v1/submissions

---

## Request

SubmissionPayload

```json
{
  "version": "1.0.0",
  "createdAt": "...",
  "information": {},
  "voice": {},
  "images": [],
  "location": {}
}
```

---

## Success Response

```json
{
  "success": true,
  "requestId": "SUB-20260707-000001",
  "status": "accepted",
  "message": "Submission accepted."
}
```

---

## Error Response

```json
{
  "success": false,
  "requestId": "...",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": []
  }
}
```

---

# Files To Create

backend/app/

api/routes/

- submissions.py

schemas/

- submission_request.py
- submission_response.py

services/

- submission_service.py

utils/

- request_id.py

tests/

- test_submission_api.py

---

# Validation Rules

Reject if:

- version missing
- title missing
- description missing
- category missing
- language missing
- payload empty

Return HTTP 422.

---

# Engineering Requirements

- Thin router
- Business logic inside SubmissionService
- No Firestore
- No Storage
- No AI
- Structured logging
- OpenAPI docs generated automatically

---

# Acceptance Criteria

- POST endpoint created
- Request schema implemented
- Response schema implemented
- Request validation works
- Request ID generated
- Logging implemented
- Swagger docs available
- Tests passing
- Build passing

---

# Smoke Tests

Run:

GET /health

↓

200 OK

POST /api/v1/submissions

↓

Valid payload

↓

200 OK

POST invalid payload

↓

422 Validation Error

Swagger

↓

Endpoint documented

pytest

↓

Pass

---

# Git Commit

feat(api): implement backend submission endpoint

---

# Deliverables

At completion provide:

1. Folder tree
2. Files created
3. API documentation
4. Request example
5. Response example
6. Validation rules
7. Test results
8. Build status

---

# Stop Condition

Stop immediately after FP-2.1.

Do not start Firestore.

Do not start Firebase Storage.

Do not start FP-2.2.