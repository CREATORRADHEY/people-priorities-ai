import apiClient from './apiClient';
import { UploadResponse } from '../../features/submission/types/api';

export const mediaApi = {
  uploadMedia: async (
    submissionId: string,
    voiceBlob: Blob | null,
    imageFiles: File[]
  ): Promise<UploadResponse> => {
    const formData = new FormData();

    if (voiceBlob) {
      formData.append('voice', voiceBlob, 'voice.webm');
    }

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await apiClient.post<UploadResponse>(
      `/submissions/${submissionId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
};
