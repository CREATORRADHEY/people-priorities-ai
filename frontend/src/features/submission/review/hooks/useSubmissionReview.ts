import { useMemo } from 'react';
import { useSubmissionDraft } from '../../hooks/useSubmissionDraft';
import { buildSubmissionPayload } from '../../services/payloadBuilder';

export function useSubmissionReview() {
  const { draft } = useSubmissionDraft();

  const validation = useMemo(() => {
    const errors: string[] = [];

    // 1. Information Section Validation
    const info = draft.information;
    if (!info) {
      errors.push("Information form is incomplete.");
    } else {
      if (!info.title?.trim()) errors.push("Issue title is required.");
      if (!info.description?.trim()) errors.push("Issue description is required.");
      if (!info.category?.trim()) errors.push("Issue category is required.");
      if (!info.language?.trim()) errors.push("Preferred language is required.");
    }

    // 2. Voice Section Validation
    if (!draft.voice?.blob) {
      errors.push("Voice recording evidence is required.");
    }

    // 3. Location Section Validation
    if (!draft.location) {
      errors.push("Location evidence is required.");
    } else if (draft.location.source === 'manual' && !draft.location.locality?.trim()) {
      errors.push("Manual location locality is required.");
    } else if (draft.location.source === 'gps' && (draft.location.latitude === undefined || draft.location.longitude === undefined)) {
      errors.push("GPS location coordinates are missing.");
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  }, [draft]);

  const payload = useMemo(() => {
    if (!validation.isValid) return null;
    return buildSubmissionPayload(draft);
  }, [draft, validation.isValid]);

  return {
    draft,
    payload,
    errors: validation.errors,
    isValid: validation.isValid,
  };
}
