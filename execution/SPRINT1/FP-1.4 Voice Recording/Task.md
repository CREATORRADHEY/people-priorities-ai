📦 Feature Pack FP-1.4
Voice Recording

Sprint: 1
Priority: P0
Estimated Time: 90–120 minutes
Dependencies: FP-1.3 ✅

Objective

Allow citizens to record a voice message describing their issue in their preferred language.

This Feature Pack is frontend-only.

We are not doing speech-to-text, Gemini, uploads, or backend storage yet.

User Story

As a citizen, I may find it easier to speak than type, so I want to record my issue using my voice.

Scope
✅ Implement
Voice recording UI
Microphone permission request
Record button
Stop recording
Playback recorded audio
Delete recording
Re-record
Continue button
Progress bar (Step 2 of 4)
❌ Do NOT Implement
Speech-to-text
Gemini
Upload to backend
Firebase Storage
AI
Transcription
Noise suppression
Audio compression
User Flow
Step 1 Information ✅

↓

Continue

↓

Step 2 Voice

↓

Grant Permission

↓

Record

↓

Stop

↓

Playback

↓

Delete (Optional)

↓

Continue

↓

Step 3 Images
Folder Structure
frontend/src/features/submission/

voice/

├── components/
│   ├── VoiceRecorder.tsx
│   ├── RecordButton.tsx
│   ├── AudioPlayer.tsx
│   ├── RecordingTimer.tsx
│   ├── PermissionDialog.tsx
│
├── hooks/
│   └── useVoiceRecorder.ts
│
├── types/
│   └── voice.ts
│
├── pages/
│   └── VoiceRecordingPage.tsx
│
└── index.ts
UI Layout
------------------------------------

← Back

Step 2 of 4

Voice Recording

------------------------------------

🎤

Tap below to describe your issue.

[ Start Recording ]

----------------------------

00:00

----------------------------

After Recording

▶ Play

🗑 Delete

🎤 Record Again

----------------------------

Continue →

------------------------------------
Recording States
Idle

↓

Permission Request

↓

Recording

↓

Recorded

↓

Playing

↓

Deleted

↓

Idle
Browser API

Use only:

navigator.mediaDevices.getUserMedia()
MediaRecorder

No third-party recording libraries.

Audio Constraints
Format:
audio/webm

Maximum Duration:
2 minutes

Minimum Duration:
3 seconds

If recording is shorter than 3 seconds:

Show validation.

Custom Hook

Create:

useVoiceRecorder.ts

Responsibilities:

requestPermission()
startRecording()
stopRecording()
deleteRecording()
playRecording()
recordingDuration
recordingState
recordedBlob

No UI inside the hook.

Components
VoiceRecordingPage

↓

VoiceRecorder

↓

RecordButton

↓

RecordingTimer

↓

AudioPlayer
Validation
Rule	Behavior
Permission denied	Show friendly message
Recording <3 sec	Validation error
Recording >2 min	Auto stop
No recording	Continue disabled
Continue Button

If recording exists

↓

Navigate

/submit/images

Otherwise

↓

Disabled

Acceptance Criteria
 Microphone permission works
 Recording starts
 Recording stops
 Timer updates
 Playback works
 Delete works
 Continue disabled until recording exists
 Responsive UI
 No backend calls
 No console errors
 Build passes
Git Commit
feat(voice): implement voice recording workflow