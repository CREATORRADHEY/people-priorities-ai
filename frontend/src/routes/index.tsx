import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../features/landing';
import SubmitPlaceholderPage from '../features/submission/pages/SubmitPlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/submit',
    element: <SubmitPlaceholderPage />,
  },
]);
