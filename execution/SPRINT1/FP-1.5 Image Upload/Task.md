📦 Feature Pack FP-1.5
Image Upload

Sprint: 1
Priority: P0
Estimated Time: 90-120 minutes
Dependencies: FP-1.4 ✅

Objective

Allow citizens to attach supporting images to their development issue.

This Feature Pack is frontend-only.

Images are stored only in the SubmissionDraft. No backend upload.

User Story

As a citizen, I want to attach photos of the issue so that I can provide visual evidence.

Scope
✅ Implement
Image picker
Camera capture (where supported)
Multi-image upload
Image preview grid
Remove image
Validation
Continue button
Progress indicator (Step 3 of 4)
❌ Do NOT Implement
Firebase Storage
Backend upload
Image compression
AI image analysis
OCR
Geotag extraction
User Flow
Step 2 Voice
        │
        ▼
Step 3 Images
        │
        ▼
Select Images
        │
        ▼
Preview Images
        │
        ▼
Delete (Optional)
        │
        ▼
Continue
        │
        ▼
Step 4 Review
Folder Structure
frontend/src/features/submission/images/

components/

ImageUploader.tsx

ImageGrid.tsx

ImageCard.tsx

UploadButton.tsx

ValidationMessage.tsx

hooks/

useImageUpload.ts

pages/

ImageUploadPage.tsx

types/

image.ts

index.ts
UI Layout
-----------------------------------

← Back

Step 3 of 4

Upload Images

-----------------------------------

📷

Upload up to 3 images

[ Choose Images ]

or

[ Open Camera ]

--------------------------

Preview Grid

[Image 1]

[Image 2]

[Image 3]

--------------------------

Maximum: 3 images

Allowed:
JPG
PNG
WEBP

Maximum Size:
5 MB each

--------------------------

Continue →

-----------------------------------
Image Constraints
Rule	Value
Maximum Images	3
Maximum File Size	5 MB
Allowed Types	image/jpeg, image/png, image/webp
Minimum Images	0 (optional)

Images are optional.

Custom Hook

Create

useImageUpload.ts

Responsibilities:

addImages()
removeImage()
validateImages()
previewUrls
selectedFiles
cleanupObjectUrls()
Components
ImageUploadPage

↓

ImageUploader

↓

UploadButton

↓

ImageGrid

↓

ImageCard
Validation
Rule	Behavior
>3 images	Reject extras
Invalid type	Show error
>5MB	Reject image
Duplicate file	Ignore duplicate
SubmissionDraft Update

Extend

SubmissionDraft

with

images?: {
    id: string;
    file: File;
    previewUrl: string;
    size: number;
    mimeType: string;
}[];

Store only in memory.

Continue Button

Always enabled.

Images are optional.

Navigate to

/submit/review
Acceptance Criteria
 Upload from file picker
 Camera capture works (where supported)
 Preview grid renders
 Remove image works
 Validation works
 Max 3 images enforced
 File size validation
 File type validation
 Object URLs cleaned up
 Continue navigates to review
 No backend dependency
 Build passes
Git Commit
feat(images): implement image upload workflow