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
    <div className="min-h-screen bg-beige1 flex flex-col items-center justify-center px-6">
      <img
        src={FinishTitle}
        alt="회원가입이 완료되었어요!"
        className="w-full max-w-[320px] h-auto mb-6"
      />
      <img
        src={RegisterFinal}
        alt="축하 일러스트"
        className="w-full max-w-[320px] h-auto mb-8"
      />
      <p className="text-sm green-muted">곧 메인으로 돌아갑니다...</p>
    </div>
  );
}
