import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import ButtonTestPage from '@/examples/ButtonTest';
import ImageTestPage from '@/examples/ImageTest';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },

  //테스트
  {
    path: '/button',
    element: <ButtonTestPage />,
  },
  {
    path: '/image',
    element: <ImageTestPage />,
  },
]);
