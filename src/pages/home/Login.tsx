import { KakaoLogin, LoginImage } from '@/assets';

import { useCallback } from 'react';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_KEY as string;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;

function buildKakaoAuthorizeUrl() {
  const base = 'https://kauth.kakao.com/oauth/authorize';
  const q = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
    state: 'from=login',
  });
  return `${base}?${q.toString()}`;
}

export default function LoginPage() {
  const onKakaoLogin = useCallback(() => {
    const url = buildKakaoAuthorizeUrl();
    console.log('[Kakao authorize]', url);
    window.location.href = url;
  }, []);
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-8 pt-16 pb-12">
        <div className="text-green1 text-title6">
          환영합니다.
          <br /> 여행자님!
        </div>

        <div className="mt-6 flex justify-center">
          <LoginImage />
        </div>
        <div className="mt-20">
          <button
            onClick={onKakaoLogin}
            className="transition-color cursor-pointer active:scale-95"
          >
            <img src={KakaoLogin} />
          </button>
        </div>
      </div>
    </div>
  );
}
