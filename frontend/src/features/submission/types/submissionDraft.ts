import { SubmissionFormValues } from './submission';

export interface SubmissionImage {
  id: string;
  file: File;
  mimeType: string;
  size: number;
}

export interface SubmissionDraft {
  information?: SubmissionFormValues;

  voice?: {
    blob?: Blob;
    duration?: number;
  };

  images?: SubmissionImage[];

  location?: {
    latitude?: number;
    longitude?: number;
  };
}
