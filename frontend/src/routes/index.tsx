import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../features/landing';
import { SubmissionFormPage, ComingSoonPlaceholder } from '../features/submission';
import { VoiceRecordingPage } from '../features/submission/voice';
import { ImageUploadPage } from '../features/submission/images';
import { LocationPage } from '../features/submission/location';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/submit',
    element: <SubmissionFormPage />,
  },
  {
    path: '/submit/voice',
    element: <VoiceRecordingPage />,
  },
  {
    path: '/submit/images',
    element: <ImageUploadPage />,
  },
  {
    path: '/submit/location',
    element: <LocationPage />,
  },
  {
    path: '/submit/review',
    element: (
      <ComingSoonPlaceholder
        stepNumber={5}
        stepTitle="Review"
        featurePack="FP-1.7"
      />
    ),
  },
]);
