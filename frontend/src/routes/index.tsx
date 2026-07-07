import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../features/landing';
import { SubmissionFormPage } from '../features/submission';
import { VoiceRecordingPage } from '../features/submission/voice';
import { ImageUploadPage } from '../features/submission/images';
import { LocationPage } from '../features/submission/location';
import { ReviewPage, SuccessPlaceholderPage } from '../features/submission/review';
import { DashboardPage } from '../features/dashboard';

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
    element: <ReviewPage />,
  },
  {
    path: '/submit/success',
    element: <SuccessPlaceholderPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
]);

