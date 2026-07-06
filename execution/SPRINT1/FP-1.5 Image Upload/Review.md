# FP-1.5 Review

## Status

Pending Review

---

## Checklist

- [x] File picker works
- [x] Camera capture supported (native attributes)
- [x] Preview grid renders
- [x] Remove image works
- [x] Validation works (max size, file type, zero-byte rejection)
- [x] Max image limit enforced (max 3)
- [x] Object URLs cleaned (revoked on delete/unmount)
- [x] Continue navigation works (routes to `/submit/review`)
- [x] No backend dependency
- [x] Build passes

---

## Technical Notes

- Implemented `useSubmissionDraft` custom hook to share state across wizard routes in memory.
- Preview URLs generated inside `useImageUpload` hook and cleaned up on delete/unmount (completely separated from the domain state `SubmissionDraft`).
- Validation enforces: max 3 images, 5MB size limit, JPG/PNG/WEBP formats, and zero-byte rejections.
- Insertion order is preserved when appending new files.

---

Reviewed By: Antigravity Code Assistant