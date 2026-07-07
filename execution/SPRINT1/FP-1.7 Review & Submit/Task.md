📦 Feature Pack FP-1.7
Review & Submit (Submission Orchestrator)

Sprint: 1
Priority: P0
Estimated Time: 2-3 hours
Dependencies: FP-1.6 ✅

Objective

Create the final review experience where the citizen:

Reviews every piece of collected information
Can jump back to edit any section
Performs final validation
Confirms the submission

Important:

FP-1.7 does not actually submit to Firestore.

It prepares the payload.

Actual submission happens in FP-1.8.

User Story

As a citizen, I want to review everything before sending it to my MP so I can verify my submission is correct.

Scope
✅ Implement
Review page
Read complete SubmissionDraft
Summary cards
Edit buttons
Final validation
Build submission payload
Confirmation dialog
Navigate to confirmation screen (mock)
Progress step (5 of 5)
❌ Do NOT Implement
Backend APIs
Firestore
Gemini
Image uploads
Audio uploads
Authentication
User Flow
Step 4 Location
        │
        ▼
Review Page
        │
        ▼
Validate Draft
        │
        ▼
Preview Payload
        │
        ▼
Confirm Submission
        │
        ▼
Mock Success Screen

(No backend yet)
Folder Structure
frontend/src/features/submission/review/

components/

InformationSummary.tsx

VoiceSummary.tsx

ImageSummary.tsx

LocationSummary.tsx

ValidationPanel.tsx

ConfirmationDialog.tsx

hooks/

useSubmissionReview.ts

pages/

ReviewPage.tsx

SuccessPlaceholderPage.tsx

types/

review.ts

index.ts
Page Layout
------------------------------------------------

← Back

Step 5 of 5

Review Your Submission

------------------------------------------------

Information

Title

Description

Category

Language

[ Edit ]

--------------------------------------------

Voice

Recording Duration

[ Play ]

[ Edit ]

--------------------------------------------

Images

3 Images

Preview

[ Edit ]

--------------------------------------------

Location

Locality

Ward

Coordinates

[ Edit ]

--------------------------------------------

Validation

✔ Ready

--------------------------------------------

[ Submit ]

------------------------------------------------
Edit Buttons

Each section should navigate back.

Information

↓

/submit

Voice

↓

/submit/voice

Images

↓

/submit/images

Location

↓

/submit/location
Validation

Create

useSubmissionReview()

Responsibilities

Read SubmissionDraft
Check required fields
Check voice exists
Check location exists
Build payload
Return validation errors
Payload Builder

Create

SubmissionPayload

Example

{
    information: {...},

    voice: {
        duration
    },

    images: [
        {
            filename,
            mimeType,
            size
        }
    ],

    location: {...}
}

Notice:

NO

Blob

File

Preview URLs

Only metadata.

Confirmation Dialog

After clicking Submit

Show

Are you sure you want to submit this issue?

[Cancel]

[Confirm]
Mock Success Screen

After confirmation

Navigate

Submission Ready

Your report has been prepared.

Actual submission will be implemented in FP-1.8.
Acceptance Criteria
 Draft displayed
 Edit buttons work
 Validation works
 Payload generated
 Confirmation dialog
 Mock success screen
 No backend dependency
 Build passes
Git Commit
feat(review): implement review and submission orchestrator