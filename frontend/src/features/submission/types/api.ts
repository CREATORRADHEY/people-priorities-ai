export enum SubmissionWorkflowState {
  IDLE = 'IDLE',
  CREATING_SUBMISSION = 'CREATING_SUBMISSION',
  UPLOADING_VOICE = 'UPLOADING_VOICE',
  UPLOADING_IMAGES = 'UPLOADING_IMAGES',
  FINALIZING = 'FINALIZING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

export interface SubmissionPayload {
  version: string;
  createdAt: string;
  information: {
    title: string;
    description: string;
    category: string;
    language: string;
  };
  voice?: {
    duration: number;
  };
  images?: Array<{
    filename: string;
    mimeType: string;
    size: number;
  }>;
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    locality?: string;
    ward?: string;
    landmark?: string;
    source: 'gps' | 'manual';
    capturedAt: string;
  };
}

export interface SubmissionResponse {
  success: boolean;
  requestId: string;
  status: string;
  data: {
    submissionId: string;
  };
}

export interface UploadResponse {
  success: boolean;
  requestId: string;
  status: string;
  data: {
    submissionId: string;
    voiceUploaded: boolean;
    imagesUploaded: number;
  };
}

export interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  requestId?: string;
  error?: string;
}
