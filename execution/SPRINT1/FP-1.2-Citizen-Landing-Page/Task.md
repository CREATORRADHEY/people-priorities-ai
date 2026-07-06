📦 Feature Pack FP-1.2
Citizen Landing Page

Sprint: 1
Priority: P0
Estimated Time: 60-90 minutes
Dependencies: ✅ FP-1.1 Completed

Objective

Build the first screen a citizen sees when opening the application.

This screen introduces the platform and provides a clear entry point to submit a development issue.

No submission logic in this Feature Pack.

Business Goal

A citizen should understand:

What this platform is
Why they should use it
How they can contribute
How to start reporting an issue
User Story

As a citizen, I want a simple landing page so that I immediately know how to report a development issue.

Scope
✅ Implement
Responsive landing page
Header/Navbar
Hero section
Platform introduction
Features section
"Report an Issue" CTA button
Footer
React Router setup
Route to /submit
❌ Do NOT Implement
Submission form
Voice recording
Image upload
Maps
API calls
Firebase
AI
Authentication
Page Structure
-------------------------------------------------
Navbar
-------------------------------------------------

Hero Section

"Your Voice Shapes Your Community"

[ Report an Issue ]

-------------------------------------------------

How It Works

1. Submit
2. AI Understands
3. MP Reviews

-------------------------------------------------

Features

🌍 Multilingual

🎤 Voice Support

📷 Photo Upload

📍 Location Based

-------------------------------------------------

Footer
Navigation
/

↓

Landing Page

↓

Button Click

↓

/submit

↓

Blank Placeholder Page

The /submit page should exist as a placeholder only.

React Routes
/

/submit

Nothing else.

Components to Build
src/features/landing/

LandingPage.tsx

HeroSection.tsx

FeatureCard.tsx

HowItWorks.tsx

Navbar.tsx

Footer.tsx
Folder Structure
frontend/src/features/

landing/

├── components/
│      Navbar.tsx
│      HeroSection.tsx
│      FeatureCard.tsx
│      HowItWorks.tsx
│      Footer.tsx
│
├── pages/
│      LandingPage.tsx
│
└── index.ts
UI Requirements
Mobile-first
Fully responsive
Clean government-tech aesthetic
Accessible typography
Tailwind CSS only
No external UI libraries
Use Lucide React icons
CTA Button

Text:

Report a Development Issue

Action:

Navigate → /submit

No API call.

Placeholder Submit Page

Display:

Submit Development Issue

Coming in FP-1.3
Acceptance Criteria
 Landing page loads successfully
 Responsive on mobile and desktop
 Navbar renders
 Hero section renders
 Features section renders
 Footer renders
 CTA button navigates to /submit
 /submit placeholder page exists
 No console errors
 No backend dependency
Git Commit
feat(landing): create citizen landing page