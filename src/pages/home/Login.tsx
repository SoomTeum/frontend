import { KakaoLogin, LoginImage } from '@/assets';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const onKakaoLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-6 pt-16 pb-12">
        <div className="text-green1 text-title6">
          환영합니다.
          <br /> 여행자님!
        </div>

        <div className="mt-6 flex justify-center">
          <LoginImage />
        </div>
        <div className="mt-20">
          <button onClick={onKakaoLogin}>
            <img src={KakaoLogin} />
          </button>
        </div>
      </div>
    </div>
  );
}
