import { SubmissionFormValues } from './submission';

export interface SubmissionDraft {
  information?: SubmissionFormValues;

  voice?: {
    blob?: Blob;
    url?: string;
    duration?: number;
  };

  images?: any[]; // For future image attachments

  location?: {
    latitude?: number;
    longitude?: number;
  };
}
