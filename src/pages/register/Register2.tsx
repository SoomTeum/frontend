// src/pages/auth/Register2.tsx
import { useState } from 'react';
import NickTitle from '@/image/nick.svg'; // 실제 파일명/대소문자 맞춰!
import Button from '@/component/common/Button/Button';
import Alert from '@/component/common/Alert/Alert';
import { useNavigate } from 'react-router-dom';

export default function Register2() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const len = nickname.trim().length;

  const handleNext = () => {
    if (len < 2) {
      setShowAlert(true);       
      return;
    }
    navigate('/register/3');
  };

  return (
    <div className="relative min-h-screen bg-beige1 flex flex-col px-6 py-8">
      <div className="mx-auto mb-4 h-2 w-11/12 rounded-full bg-gray-200" />

      <div className="mb-1">
        <img
          src={NickTitle}
          alt="닉네임을 지어주세요!"
          className="w-full max-w-[320px] h-auto"
        />
      </div>
      <p className="mb-8 text-sm text-gray-500">Create your nickname.</p>

      <label className="mb-2 text-caption3 text-black">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Text"
        className="
          mb-6 w-full rounded-xl border border-green-600 bg-transparent
          px-4 py-3 text-sm text-black placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-green-600
        "
      />

      <div className="mt-auto w-full">
        <Button
          variant="lg"
          color="green3"
          className="w-full"
          onClick={handleNext}
          disabled={len === 0}   
          aria-label="다음 단계로 이동"
        >
          다음
        </Button>
      </div>

      {showAlert && (
        <div className="absolute left-4 right-4 bottom-24">
          <Alert onClose={() => setShowAlert(false)} className="rounded-xl shadow-md">
            2글자 이상 지어야해요.
          </Alert>
        </div>
      )}
    </div>
  );
}
