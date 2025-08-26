import { KakaoLogin, LoginImage } from '@/assets';

const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY as string;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;

const params = new URLSearchParams({
  client_id: REST_KEY,
  redirect_uri: KAKAO_REDIRECT_URI,
  response_type: 'code',
  state: 'from=login',
});

const authorizeUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;

export default function LoginPage() {
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
            onClick={() => {
              window.location.href = authorizeUrl;
            }}
            className="transition-color cursor-pointer active:scale-95"
          >
            <img src={KakaoLogin} />
          </button>
        </div>
      </div>
    </div>
  );
}
