📦 Feature Pack FP-1.6
Location & Evidence Capture

Sprint: 1
Priority: P0
Estimated Time: 90–120 minutes
Dependencies: FP-1.5 ✅

Objective

Allow the citizen to attach the location of the reported issue.

Location is an important piece of evidence for MPs because every submission should be tied to a geographic area.

This Feature Pack is frontend-only.

No backend, Maps API, or geocoding calls yet.

User Story

As a citizen, I want to provide the location of the issue so that it can be accurately identified and prioritized.

Scope
✅ Implement
GPS location capture
Manual location entry
Permission handling
Display captured coordinates
Continue button
Step 4 progress indicator
Save location in SubmissionDraft
❌ Do NOT Implement
Google Maps
Reverse geocoding
Address lookup
Backend APIs
Firestore
AI
User Flow
Step 3 Images
        │
        ▼
Step 4 Location
        │
        ▼
Allow Location?
        │
 ┌──────┴──────┐
 │             │
 ▼             ▼
GPS        Manual Entry
 │             │
 └──────┬──────┘
        ▼
Preview Location
        ▼
Continue
        ▼
Review
Folder Structure
frontend/src/features/submission/location/

components/

LocationCard.tsx

LocationPermission.tsx

CoordinateDisplay.tsx

ManualLocationForm.tsx

hooks/

useLocation.ts

pages/

LocationPage.tsx

types/

location.ts

index.ts
UI Layout
------------------------------------

← Back

Step 4 of 5

Location

------------------------------------

📍

Where is this issue located?

[ Use Current Location ]

OR

----------------------------

Area / Locality

[____________]

Ward (Optional)

[____________]

Landmark (Optional)

[____________]

----------------------------

Coordinates

Latitude

Longitude

----------------------------

Continue →

------------------------------------
SubmissionDraft Update

Extend

SubmissionDraft

with

location?: {
    latitude?: number;
    longitude?: number;
    locality?: string;
    ward?: string;
    landmark?: string;
    source: "gps" | "manual";
}
Custom Hook

Create

useLocation.ts

Responsibilities

Request browser location
Handle permission errors
Store coordinates
Update draft
Clear location
Browser API

Use only

navigator.geolocation.getCurrentPosition()

No Maps SDK.

Validation
Rule	Behavior
GPS denied	Allow manual entry
GPS unavailable	Show message
Manual locality empty	Show validation
Coordinates available	Display them
Manual entry	Continue allowed
Components
LocationPage

↓

LocationPermission

↓

ManualLocationForm

↓

CoordinateDisplay

↓

LocationCard
Continue Button

If

GPS location captured

OR

Manual locality entered

↓

Navigate to

/submit/review
Acceptance Criteria
 GPS permission works
 Manual fallback works
 Coordinates display
 Draft updated
 Continue navigation works
 Responsive
 No backend dependency
 Build passes
Git Commit
feat(location): implement location capture workflow