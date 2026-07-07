# REST API Reference Docs

The platform exposes the following REST API endpoints under `/api/v1`.

---

## 1. Citizen Grievance Intake

### A. Create Citizen Submission
Creates a submission record inside the operational database.
* **URL**: `/api/v1/submissions`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "version": "1.0.0",
    "createdAt": "2026-07-07T14:50:00Z",
    "information": {
      "title": "Broken Water Pipeline",
      "description": "Clean water is leaking onto the main road in Ward 3.",
      "category": "Water Supply",
      "language": "en"
    },
    "voice": {
      "duration": 8.4
    },
    "images": [
      {
        "filename": "leak.jpg",
        "mimeType": "image/jpeg",
        "size": 240000
      }
    ],
    "location": {
      "latitude": 12.9715,
      "longitude": 77.5945,
      "accuracy": 5.0,
      "locality": "MG Road",
      "ward": "Ward 3"
    }
  }
  ```
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145000",
    "status": "received",
    "data": {
      "submissionId": "sub-uuid-12345"
    }
  }
  ```

### B. Upload Media Assets
Uploads audio or image binary files corresponding to an existing submission.
* **URL**: `/api/v1/media/upload`
* **Method**: `POST`
* **Headers**: `Content-Type: multipart/form-data`
* **Form Parameters**:
  * `file`: (Binary file data)
  * `submissionId`: `sub-uuid-12345`
  * `mediaType`: `"image"` | `"voice"`
  * `filename`: `"leak.jpg"`
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145001",
    "data": {
      "mediaUrl": "https://storage.googleapis.com/people-priorities-bucket/sub-uuid-12345/leak.jpg"
    }
  }
  ```

---

## 2. Decision Intelligence Portal

### A. Get Summary Metrics
Gives aggregated card counts for top-level dashboard metrics.
* **URL**: `/api/v1/dashboard/summary`
* **Method**: `GET`
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145002",
    "data": {
      "totalSubmissions": 120,
      "highPriorityCount": 15,
      "criticalPriorityCount": 4,
      "hotspotsCount": 2,
      "pendingReviewCount": 8
    }
  }
  ```

### B. Get Priority Queue
Retrieves the prioritized list of reports.
* **URL**: `/api/v1/dashboard/priorities`
* **Method**: `GET`
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145003",
    "data": [
      {
        "submissionId": "sub-uuid-12345",
        "title": "Broken Water Pipeline",
        "locality": "MG Road",
        "category": "Water Supply",
        "priorityScore": 88,
        "priorityLevel": "CRITICAL",
        "recommendedAction": "Deploy pipeline emergency repair team.",
        "processedAt": "2026-07-07T14:50:05Z"
      }
    ]
  }
  ```

### C. Get Active Hotspots
Retrieves wards with aggregated issues above the threshold.
* **URL**: `/api/v1/dashboard/hotspots`
* **Method**: `GET`
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145004",
    "data": [
      {
        "locality": "Ward 3",
        "issueCount": 7,
        "topCategory": "Water Supply",
        "isHotspot": true
      }
    ]
  }
  ```

### D. Get Lineage Details
Returns complete joined lineage data for the Submission Explorer drawer.
* **URL**: `/api/v1/dashboard/submissions/{submission_id}`
* **Method**: `GET`
* **Response Body (200 OK)**:
  ```json
  {
    "success": true,
    "requestId": "SUB-20260707-145005",
    "data": {
      "submission": {
        "id": "sub-uuid-12345",
        "status": "RECEIVED",
        "information": {
          "title": "Broken Water Pipeline",
          "category": "Water Supply",
          "language": "en"
        }
      },
      "analysis": {
        "summary": "Water main break leaking on road.",
        "confidence": 0.96,
        "themes": ["Water Supply", "Infrastructure Damage"],
        "processedAt": "2026-07-07T14:50:06Z"
      },
      "intelligence": {
        "priorityScore": 88,
        "priorityLevel": "CRITICAL",
        "recommendedAction": "Deploy pipeline emergency repair team.",
        "recommendedDepartment": "Water Resources Board",
        "urgency": "Immediate",
        "isHotspot": true,
        "isDuplicate": false,
        "generatedAt": "2026-07-07T14:50:10Z"
      }
    }
  }
  ```
