import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithKakaoAccessToken } from '@/api/user/auth.api';

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
        const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI!; // 인가 때와 "완전히" 동일해야 함

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

        //홈/온보딩으로
        window.history.replaceState(null, '', '/');
        navigate(result?.newUser ? '/onboarding' : '/', { replace: true });
      } catch (e) {
        console.error(e);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return <div className="p-6">카카오 로그인 처리 중…</div>;
}
