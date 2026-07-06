export interface SubmissionFormValues {
  fullName: string;
  mobileNumber: string;
  title: string;
  description: string;
  category: string;
  language: string;
}

export interface SubmissionFormErrors {
  fullName?: string;
  mobileNumber?: string;
  title?: string;
  description?: string;
  category?: string;
  language?: string;
}
