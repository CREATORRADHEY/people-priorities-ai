📦 Feature Pack FP-1.3
Citizen Submission Form UI

Sprint: 1
Priority: P0
Estimated Time: 90-120 minutes
Dependencies: FP-1.2 ✅

Objective

Build the complete citizen submission form UI.

This Feature Pack focuses only on the frontend user interface.

There will be no backend integration, no Firestore, and no API calls.

User Story

As a citizen, I want an intuitive form to describe my development issue so I can prepare my submission before sending it.

Scope
✅ Implement
Submission page layout
Form UI
Client-side validation
Progress indicator
Responsive layout
Continue button
Success/error validation messages (client-side only)
❌ Do NOT Implement
API calls
Firestore
Voice recording
Image upload
Maps
GPS
AI
Data persistence
Form Fields
Field	Required
Full Name	Optional
Mobile Number	Optional
Development Issue Title	✅
Development Issue Description	✅
Category	✅
Preferred Language	✅
Categories
Roads
Water Supply
Electricity
Education
Healthcare
Sanitation
Public Transport
Agriculture
Women & Child Welfare
Other
Languages
English

हिन्दी

मराठी

ગુજરાતી

தமிழ்

తెలుగు

ಕನ್ನಡ

বাংলা
User Flow
Landing Page

↓

Report Issue

↓

Submission Form

↓

Fill Details

↓

Validation

↓

Continue Button

↓

Temporary Success Screen

(Not Submitted)
Folder Structure
frontend/src/features/submission/

components/

FormField.tsx

TextArea.tsx

CategorySelect.tsx

LanguageSelect.tsx

ProgressBar.tsx

ValidationMessage.tsx

pages/

SubmissionFormPage.tsx

constants/

categories.ts

languages.ts

validation.ts

hooks/

useSubmissionForm.ts

types/

submission.ts

index.ts
UI Layout
------------------------------------

← Back

Report Development Issue

Progress (Step 1 of 4)

----------------------------

Full Name

[____________]

Mobile Number

[____________]

Issue Title *

[____________]

Issue Description *

[____________________]

Category *

[Dropdown]

Preferred Language *

[Dropdown]

----------------------------

[ Continue ]

------------------------------------
Validation Rules
Field	Rule
Title	Required, 10–100 chars
Description	Required, 30–1000 chars
Category	Required
Language	Required
Mobile	Optional, if entered must be valid
Name	Optional
State Management

Use React state only.

No Redux.

No Context API.

No Local Storage.

No Session Storage.

Components

Each component should have a single responsibility.

SubmissionFormPage

↓

ProgressBar

↓

FormField

↓

CategorySelect

↓

LanguageSelect

↓

ValidationMessage
UX Requirements
Mobile-first
Accessible labels
Keyboard navigation
Clear validation
Large touch targets
Clean spacing
Consistent typography
Acceptance Criteria
 Form renders correctly
 Responsive
 Validation works
 Required fields enforced
 Continue button disabled until valid
 No backend calls
 No console errors
 TypeScript passes
 Build succeeds
Git Commit
feat(submission): build citizen submission form UI