import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithKakaoAccessToken } from '@/api/user/auth.api';
import { likePlace } from '@/api/like/like.api';

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

        // 1) 우리 서버 로그인
        const result = await loginWithKakaoAccessToken(kakaoAccessToken);

        // 2) state/세션에서 복귀 경로와 액션 꺼내기
        const rawState = qs.get('state');
        let redirectFromState: string | undefined;
        let actionFromState: any;
        try {
          const parsed = rawState ? JSON.parse(rawState) : null;
          redirectFromState = parsed?.redirect;
          actionFromState = parsed?.action;
        } catch {
          // 만약 state를 그냥 경로 문자열로 쓴 경우 대비
          redirectFromState = rawState || undefined;
        }

        const fromStorage = sessionStorage.getItem('postLoginRedirect');
        const actionStorage = sessionStorage.getItem('postLoginAction');

        const redirectTo =
          pickSafeInternalPath(redirectFromState) || pickSafeInternalPath(fromStorage) || '/';

        const action = actionFromState || (actionStorage ? JSON.parse(actionStorage) : null);

        // 한번 쓰면 비워두기
        sessionStorage.removeItem('postLoginRedirect');
        sessionStorage.removeItem('postLoginAction');

        // 3) 신규 유저는 온보딩으로
        if (result.newUser) {
          navigate('/register/2', { replace: true });
          return;
        }

        // 4) 액션 재생 (예: 상세에서 비로그인으로 누른 '좋아요')
        if (action?.kind === 'LIKE_PLACE' && action.contentId) {
          try {
            await likePlace({
              contentId: action.contentId,
              ...(action.payload ?? {}),
            });
            // 선택: 돌아간 페이지에서 토스트 띄우고 싶으면 플래그 남기기
            sessionStorage.setItem('postLoginToast', '좋아요 완료!');
          } catch (e) {
            console.error('post-login like failed', e);
            sessionStorage.setItem('postLoginToast', '좋아요에 실패했어요.');
          }
        }

        // 5) 원래 페이지로 replace 이동 (history에 콜백 안 남김)
        navigate(redirectTo, { replace: true });
      } catch (e) {
        console.error(e);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return <div className="p-6">카카오 로그인 처리 중…</div>;
}
