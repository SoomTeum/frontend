import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import ButtonTestPage from '@/examples/ButtonTest';
import MyTravelList from '@/pages/home/MyTravelList'; // ✅ 추가

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/button',
    element: <ButtonTestPage />,
  },
  {
    path: '/mytravel', // ✅ 나의 여행지 페이지
    element: <MyTravelList />,
  },
]);
