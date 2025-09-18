import { KakaoLogin, LoginImage } from '@/assets';
import { useLocation } from 'react-router-dom';

const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY as string;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;

function buildAuthorizeUrl(stateObj: unknown) {
  const params = new URLSearchParams({
    client_id: REST_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
    state: JSON.stringify(stateObj),
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

function pickSafeInternalPath(p?: string | null) {
  if (!p) return undefined;
  if (!p.startsWith('/')) return undefined;
  if (p.startsWith('/login')) return undefined;
  return p;
}

export default function LoginPage() {
  const location = useLocation();

  function handleKakaoLogin() {
    const qs = new URLSearchParams(location.search);

    //1)복귀 경로 결정
    const candidate =
      qs.get('redirect') || `${location.pathname}${location.search}${location.hash}`;
    const backup = sessionStorage.getItem('postLoginRedirect');
    const redirect = pickSafeInternalPath(candidate) || pickSafeInternalPath(backup) || '/';

    //2)액션 힌트
    let action: any = null;
    const stored = sessionStorage.getItem('postLoginAction');
    if (stored) {
      try {
        action = JSON.parse(stored);
      } catch {
        action = null;
      }
    } else if (qs.get('action') === 'like_place' && qs.get('cid')) {
      action = { kind: 'LIKE_PLACE', contentId: qs.get('cid') };
    }

    sessionStorage.setItem('postLoginRedirect', redirect);
    if (action) sessionStorage.setItem('postLoginAction', JSON.stringify(action));

    const authorizeUrl = buildAuthorizeUrl({ redirect, action });
    window.location.href = authorizeUrl;
  }

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
            onClick={handleKakaoLogin}
            className="transition-color cursor-pointer active:scale-95"
          >
            <img src={KakaoLogin} />
          </button>
        </div>
      </div>
    </div>
  );
}
