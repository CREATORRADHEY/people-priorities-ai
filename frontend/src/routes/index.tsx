import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../features/landing';
import { SubmissionFormPage, ComingSoonPlaceholder } from '../features/submission';

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
    element: (
      <ComingSoonPlaceholder
        stepNumber={2}
        stepTitle="Voice"
        featurePack="FP-1.4"
      />
    ),
  },
  {
    path: '/submit/images',
    element: (
      <ComingSoonPlaceholder
        stepNumber={3}
        stepTitle="Images"
        featurePack="FP-1.5"
      />
    ),
  },
  {
    path: '/submit/review',
    element: (
      <ComingSoonPlaceholder
        stepNumber={4}
        stepTitle="Review"
        featurePack="FP-1.6"
      />
    ),
  },
]);
