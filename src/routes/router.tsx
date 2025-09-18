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
import TravelSpotDetail from '@/pages/ai/TravelSpotDetail';
import AIResultPage from '@/pages/ai/AIResultPage';
import LoginPage from '@/pages/home/Login';
import KakaoCallbackPage from '@/pages/home/KakaoCallbackPage';
import Register2 from '@/pages/register/Register2';
import Register3 from '@/pages/register/Register3';
import Searching from '@/pages/explore/Searching';
import TravelSearch from '@/pages/home/TravelSearch';
import RequireAuth from './RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/register/2',
    element: <Register2 />,
  },
  {
    path: '/register/3',
    element: <Register3 />,
  },
  {
    path: '/alert',
    element: <AlertComponent />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/api/auth/kakao/callback',
    element: <KakaoCallbackPage />,
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
      {
        path: 'result',
        element: <AIResultPage />,
      },
      {
        path: 'searching',
        element: <Searching />,
      },
      {
        path: 'travelsearch',
        element: <TravelSearch />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/mytravel', element: <MyTravelList /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
  {
    path: '/place/:contentId',
    element: <TravelSpotDetail />,
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
]);
