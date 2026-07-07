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
    duration?: number;
  };
  
  images?: {
    filename: string;
    mimeType: string;
    size: number;
  }[];
  
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
