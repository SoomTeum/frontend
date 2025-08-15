import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/Homepage';
import MyTravelList from '@/pages/home/MyTravelList';
import MyPage from '@/pages/home/MyPage';
import RegionSelector from '@/component/selector/RegionSelector';
import TravelActivitySelector from '@/component/selector/TravelActivitySelector';
import CardTestPage from '@/examples/CardTest';
import AlertComponent from '@/examples/AlertTest';
import AiExploreMain from '@/pages/ai/MainAI';
import ThemeSelcetPage from '@/pages/ai/ThemeSelect';
import Filter from '@/pages/explore/Filter';
import Register1 from '@/pages/register/Register1';
import Register2 from '@/pages/register/Register2';
import Register3 from '@/pages/register/Register3';
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
    path: '/region', 
    element: <RegionSelector />,
  },
  {
    path: '/activity', 
    element: <TravelActivitySelector />,
  },
  {
    path: '/card',
    element: <CardTestPage />,
  },
  {
    path: '/explore/Filter', 
    element: <Filter />,
  },
  {
    path: '/register/1',
    element: <Register1 />,
  },
  {
    path: '/register/2',
    element: <Register2 />,
  },
  {
   path: '/register/3',
   element: <Register3 />,
  },
]);
