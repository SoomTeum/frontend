import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithKakaoCode } from '@/api/user/auth.api';

export default function KakaoCallbackPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const once = useRef(false); // StrictMode 중복 방지

  useEffect(() => {
    const code = sp.get('code');
    if (!code || once.current) return;
    once.current = true;

    (async () => {
      try {
        const res = await loginWithKakaoCode(code);
        navigate(res.newUser ? '/onboarding' : '/', { replace: true });
      } catch (e) {
        console.error(e);
        alert('잘못된 카카오 로그인 요청입니다. 다시 시도해주세요.');
        navigate('/login', { replace: true });
      }
    })();
  }, [sp, navigate]);

  return <div className="text-title7 p-6">카카오 로그인 처리중...</div>;
}
