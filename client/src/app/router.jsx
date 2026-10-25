import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LandingPage from '../pages/LandingPage';
import CreateMysteryPage from '../pages/CreateMysteryPage';
import GenerationPage from '../pages/GenerationPage';
import InvestigationPage from '../pages/InvestigationPage';
import VerdictPage from '../pages/VerdictPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'create', element: <CreateMysteryPage /> },
      { path: 'jobs/:jobId', element: <GenerationPage /> },
      { path: 'investigation/:mysteryId', element: <InvestigationPage /> },
      { path: 'verdict/:sessionId', element: <VerdictPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
