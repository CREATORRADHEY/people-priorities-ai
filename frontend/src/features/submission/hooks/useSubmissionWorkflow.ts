import { useState, useCallback } from 'react';
import { SubmissionWorkflowState, SubmissionResult } from '../types/api';
import { SubmissionWorkflow } from '../services/submissionWorkflow';
import { SubmissionDraft } from '../types/submissionDraft';

export interface UseSubmissionWorkflowReturn {
  loading: boolean;
  state: SubmissionWorkflowState;
  error: string | null;
  submissionId: string | null;
  requestId: string | null;
  submitDraft: (draft: SubmissionDraft) => Promise<SubmissionResult>;
  resetWorkflow: () => void;
}

export function useSubmissionWorkflow(): UseSubmissionWorkflowReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<SubmissionWorkflowState>(SubmissionWorkflowState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const resetWorkflow = useCallback(() => {
    setLoading(false);
    setState(SubmissionWorkflowState.IDLE);
    setError(null);
    setSubmissionId(null);
    setRequestId(null);
  }, []);

  const submitDraft = useCallback(async (draft: SubmissionDraft): Promise<SubmissionResult> => {
    setLoading(true);
    setError(null);
    
    const result = await SubmissionWorkflow.submit(draft, (newState) => {
      setState(newState);
    });

    setLoading(false);
    if (result.success) {
      setSubmissionId(result.submissionId || null);
      setRequestId(result.requestId || null);
    } else {
      setError(result.error || 'Submission failed');
    }

    return result;
  }, []);

  return {
    loading,
    state,
    error,
    submissionId,
    requestId,
    submitDraft,
    resetWorkflow
  };
}
