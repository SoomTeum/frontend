import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);
