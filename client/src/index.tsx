import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import Home from './pages/Home';
import SavedGames from './pages/SavedGames';
import CreateGame from './pages/CreateGame';
import Marker from './pages/Marker';
import Players from './pages/Players';
import Folders from './pages/Folders';
import Rounds from './pages/Rounds';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/create',
    element: <Navigate to="/create-game" replace />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/saved-games',
    element: <Layout><SavedGames /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/create-game',
    element: <Layout><CreateGame /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/marker/:id',
    element: <Layout><Marker /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/players',
    element: <Layout><Players /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/folders',
    element: <Layout><Folders /></Layout>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/rounds',
    element: <Layout><Rounds /></Layout>,
    errorElement: <ErrorBoundary />
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
