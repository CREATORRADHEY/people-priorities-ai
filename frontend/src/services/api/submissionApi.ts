import apiClient from './apiClient';
import { SubmissionPayload, SubmissionResponse } from '../../features/submission/types/api';

export const submissionApi = {
  createSubmission: async (payload: SubmissionPayload): Promise<SubmissionResponse> => {
    const response = await apiClient.post<SubmissionResponse>('/submissions', payload);
    return response.data;
  }
};
