import WelcomeIllustration from '@/image/Welcome.svg';
import Button from '@/component/common/Button/Button';
import { useNavigate } from 'react-router-dom';

export default function Register1() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-beige1 flex flex-col items-center justify-between px-6 pt-12 pb-10">
      <div className="w-full flex justify-center px-2 mt-8 md:mt-10">
        <div className="w-full max-w-[320px] text-left">
          <h1 className="font-extrabold text-[27px] leading-[32px] md:text-[28px] md:leading-[36px]  tracking-tight ">
            숨여행, 틈이 처음이시네요!<br />
            초기 설정을 진행할게요.
          </h1>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        <img
          src={WelcomeIllustration}
          alt="환영 일러스트"
          className="w-full max-w-[280px] h-auto"
        />
      </div>

      <div className="w-full">
        <Button
          variant="lg"
          color="green3"
          className="w-full"
          onClick={() => navigate('/register/2')}
          aria-label="다음 단계로 이동"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
