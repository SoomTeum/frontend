import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FinishTitle from '@/image/Finish.svg';
import RegisterFinal from '@/image/Registerf.svg';

export default function Register3() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="bg-beige1 flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-title3 text-green1">회원가입이 완료되었어요!</div>
      <img
        src={RegisterFinal}
        alt="축하 일러스트"
        className="mb-8 h-auto w-full max-w-[320px] px-6"
      />
      <p className="text-green-muted text-caption3">곧 메인으로 돌아갑니다...</p>
    </div>
  );
}
