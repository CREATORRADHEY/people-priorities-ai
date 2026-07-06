import { useState, useEffect, useCallback } from 'react';
import { SubmissionDraft } from '../types/submissionDraft';

let globalDraft: SubmissionDraft = {
  images: [],
};

const listeners = new Set<(draft: SubmissionDraft) => void>();

export function useSubmissionDraft() {
  const [draft, setDraftState] = useState<SubmissionDraft>(globalDraft);

  useEffect(() => {
    const listener = (newDraft: SubmissionDraft) => {
      // Create a shallow copy to ensure React triggers re-render
      setDraftState({ ...newDraft });
    };
    listeners.add(listener);
    
    // Set initial state from globalDraft
    setDraftState({ ...globalDraft });

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateDraft = useCallback((updater: (prev: SubmissionDraft) => SubmissionDraft) => {
    globalDraft = updater(globalDraft);
    listeners.forEach((l) => l(globalDraft));
  }, []);

  return {
    draft,
    updateDraft,
  };
}
