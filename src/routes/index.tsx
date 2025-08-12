import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import ButtonTestPage from '@/examples/ButtonTest';
import MyTravelList from '@/pages/home/MyTravelList';
import MyPage from '@/pages/home/MyPage'; 
import RegionSelector from '@/component/selector/RegionSelector';
import TravelActivitySelector from '@/component/selector/TravelActivitySelector'; 
import CardTestPage from '@/examples/CardTest';
import Filter from '@/pages/explore/Filter'; 
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

    path: '/card',
    element: <CardTestPage />,

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
    path: '/explore/Filter', // ✅ 여행탐색 Filter 페이지 테스트용
    element: <Filter />,
  },
]);
