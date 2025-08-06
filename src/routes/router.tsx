import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import MyTravelList from '@/pages/home/MyTravelList';
import MyPage from '@/pages/home/MyPage';
import RegionSelector from '@/component/selector/RegionSelector';
import TravelActivitySelector from '@/component/selector/TravelActivitySelector';

import CardTestPage from '@/examples/CardTest';
import AlertComponent from '@/examples/AlertTest';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/alert',
    element: <AlertComponent />,
  },
  {
    path: '/mytravel',
    element: <MyTravelList />,
  },
  {
    path: '/mypage',
    element: <MyPage />,
  },
  {
    path: '/region', // 지역 선택 테스트용
    element: <RegionSelector />,
  },
  {
    path: '/activity', // ✅ 여행 활동 선택 테스트용
    element: <TravelActivitySelector />,
  },
  {
    path: '/card',
    element: <CardTestPage />,
  },
]);
