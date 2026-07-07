import { SubmissionWorkflowState } from '../types/api';

export const PROGRESS_MESSAGES: Record<SubmissionWorkflowState, string> = {
  [SubmissionWorkflowState.IDLE]: 'Ready to submit',
  [SubmissionWorkflowState.CREATING_SUBMISSION]: 'Creating Submission...',
  [SubmissionWorkflowState.UPLOADING_VOICE]: 'Uploading Voice...',
  [SubmissionWorkflowState.UPLOADING_IMAGES]: 'Uploading Images...',
  [SubmissionWorkflowState.FINALIZING]: 'Finalizing...',
  [SubmissionWorkflowState.DONE]: 'Done',
  [SubmissionWorkflowState.ERROR]: 'Upload Failed'
};
