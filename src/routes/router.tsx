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
import AILoadingPage from '@/pages/ai/AILoadingPage';
import AIResultPage from '@/pages/ai/AIResultPage';
import LoginPage from '@/pages/home/Login';
import Register from '@/pages/register/Register';
import Register2 from '@/pages/register/Register2';
import Register3 from '@/pages/register/Register3';
import KakaoCallbackPage from '@/pages/home/KakaoCallbackPage';
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
        path: 'loading',
        element: <AILoadingPage />,
      },
      {
        path: 'result',
        element: <AIResultPage />,
      },
    ],
  },
  //여행지 상세페이지
  {
    path: '/place/:contentId',
    element: <TravelSpotDetail />,
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
  {
    path: '/register/1',
    element: <Register />,
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
