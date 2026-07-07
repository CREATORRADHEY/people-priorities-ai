import { SubmissionDraft } from '../types/submissionDraft';
import { SubmissionPayload } from '../review/types/review';

export function buildSubmissionPayload(draft: SubmissionDraft): SubmissionPayload {
  const information = {
    title: draft.information?.title || '',
    description: draft.information?.description || '',
    category: draft.information?.category || '',
    language: draft.information?.language || '',
  };

  const voice = draft.voice ? {
    duration: draft.voice.duration,
  } : undefined;

  const images = draft.images?.map((img) => ({
    filename: img.file.name,
    mimeType: img.mimeType,
    size: img.size,
  }));

  const location = draft.location ? {
    latitude: draft.location.latitude,
    longitude: draft.location.longitude,
    accuracy: draft.location.accuracy,
    locality: draft.location.locality,
    ward: draft.location.ward,
    landmark: draft.location.landmark,
    source: draft.location.source,
    capturedAt: draft.location.capturedAt,
  } : undefined;

  return {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    information,
    voice,
    images,
    location,
  };
}
