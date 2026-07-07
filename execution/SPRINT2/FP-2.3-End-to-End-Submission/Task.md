📦 Feature Pack FP-2.3
Firebase Storage Integration

Sprint: 2
Priority: P0
Estimated Time: 3–4 Hours
Dependencies:

FP-2.1 ✅
FP-2.2 ✅
Objective

Implement media upload to Firebase Storage.

Store:

Voice recordings
Images

Then update the Firestore submission document with storage metadata.

Scope
✅ Implement
Firebase Storage service
Voice upload
Image upload
Public/Download URL retrieval
Firestore metadata update
Storage repository
Upload validation
Error handling
❌ Do NOT Implement
AI processing
Image compression
Audio transcoding
OCR
Speech-to-text
Dashboard
Upload Architecture
Frontend
      │
      ▼
Submission API
      │
      ▼
Firestore Document Created
      │
      ▼
submissionId
      │
      ▼
Upload Voice
      │
      ▼
Upload Images
      │
      ▼
Update Firestore Media Metadata
      │
      ▼
Success
Storage Layout
Firebase Storage

submissions/

    {submissionId}/

        voice/

            audio.webm

        images/

            image_1.jpg

            image_2.jpg

            image_3.jpg
Folder Changes
backend/app/

storage/

    base_storage_service.py

    firebase_storage_service.py

repositories/

    storage_repository.py

services/

    media_upload_service.py

schemas/

    upload_response.py

tests/

    test_storage_service.py
Storage Service

Create

BaseStorageService

Methods

upload_voice()

upload_image()

delete_file()

get_download_url()
Concrete Implementation
FirebaseStorageService

Responsibilities

Upload files
Generate storage path
Return download URL
Handle failures
Delete orphaned uploads if required
Firestore Update

After upload

Update submission

{
  "voice": {
    "path": "...",
    "url": "...",
    "duration": 12
  },

  "images": [
    {
      "path": "...",
      "url": "...",
      "mimeType": "...",
      "size": ...
    }
  ]
}
Upload Rules

Voice

webm only
max 2 minutes

Images

jpg
png
webp
max 3
API Response
{
  "success": true,

  "requestId": "...",

  "status": "uploaded",

  "data": {
      "submissionId": "...",
      "voiceUploaded": true,
      "imagesUploaded": 3
  }
}
Acceptance Criteria
 Storage service implemented
 Voice upload works
 Image upload works
 Download URLs generated
 Firestore updated
 Repository updated
 Tests pass
 Build passes
Git Commit
feat(storage): integrate firebase storage