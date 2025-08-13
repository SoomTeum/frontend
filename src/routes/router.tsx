import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import MyTravelList from '@/pages/home/MyTravelList';
import MyPage from '@/pages/home/MyPage';
import RegionSelector from '@/component/selector/RegionSelector';
import TravelActivitySelector from '@/component/selector/TravelActivitySelector';
import CardTestPage from '@/examples/CardTest';
import AlertComponent from '@/examples/AlertTest';

import Filter from '@/pages/explore/Filter'; 
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },

  //테스트
  {
    path: '/alert',
    element: <AlertComponent />,
  },
  {
    path: '/card',
    element: <CardTestPage />,
  },
  {
    path: '/explore',
    children: [
      {
        index: true,
        element: <AiExploreMain />,
      },
      {
        path: 'theme',
        element: <ThemeSelcetPage />,
      },
    ],
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
  {
      path: '/explore/Filter', // ✅ 여행탐색 Filter 페이지 테스트용
      element: <Filter />,
    },
]);
