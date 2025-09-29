import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithKakaoAccessToken } from '@/api/user/auth.api';
import { likePlace } from '@/api/like/like.api';
import { Loader } from '@/component';

function pickSafeInternalPath(p?: string | null) {
  if (!p) return undefined;
  if (!p.startsWith('/')) return undefined; // 오픈 리다이렉트 방지
  if (p.startsWith('/login')) return undefined; // 로그인 페이지로 복귀 방지
  return p;
}

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        const qs = new URLSearchParams(window.location.search);
        const code = qs.get('code');
        const err = qs.get('error');
        if (err) throw new Error(qs.get('error_description') || err);
        if (!code) throw new Error('인가 코드가 없습니다.');

        const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY!;
        const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI!; // 인가 때와 동일

        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: REST_KEY,
          redirect_uri: REDIRECT_URI,
          code,
        });

        const tokenResp = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
          body: body.toString(),
        });
        const tokenJson = await tokenResp.json();
        if (!tokenResp.ok) {
          throw new Error(
            tokenJson.error_description || tokenJson.error || '카카오 토큰 교환 실패',
          );
        }
        const kakaoAccessToken = tokenJson.access_token as string;

        const result = await loginWithKakaoAccessToken(kakaoAccessToken);

        const rawState = qs.get('state');
        let redirectFromState: string | undefined;
        let actionFromState: any;
        try {
          const parsed = rawState ? JSON.parse(rawState) : null;
          redirectFromState = parsed?.redirect;
          actionFromState = parsed?.action;
        } catch {
          redirectFromState = rawState || undefined;
        }

        const fromStorage = sessionStorage.getItem('postLoginRedirect');
        const actionStorage = sessionStorage.getItem('postLoginAction');

        const redirectTo =
          pickSafeInternalPath(redirectFromState) || pickSafeInternalPath(fromStorage) || '/';

        const action = actionFromState || (actionStorage ? JSON.parse(actionStorage) : null);

        sessionStorage.removeItem('postLoginRedirect');
        sessionStorage.removeItem('postLoginAction');

        if (result.newUser) {
          navigate('/register/1', { replace: true });
          return;
        }

        if (action?.kind === 'LIKE_PLACE' && action.contentId) {
          try {
            await likePlace({
              contentId: action.contentId,
              ...(action.payload ?? {}),
            });

            sessionStorage.setItem('postLoginToast', '좋아요 완료!');
          } catch (e) {
            console.error('post-login like failed', e);
            sessionStorage.setItem('postLoginToast', '좋아요에 실패했어요.');
          }
        }

        navigate(redirectTo, { replace: true });
      } catch (e) {
        console.error(e);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <Loader className="w-80" />
    </div>
  );
}
