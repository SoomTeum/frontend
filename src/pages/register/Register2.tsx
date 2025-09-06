// src/pages/register/Register2.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NickTitle from '@/image/nick.svg';
import Button from '@/component/common/Button/Button';
import Alert from '@/component/common/Alert/Alert';
import api from '@/api/api';
import type { ApiResponse } from '@/types/api-response';

// 서버가 돌려주는 형태 (참고용)
type Profile = {
  userId: number;
  email: string;
  nickname: string;
};

export default function Register2() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string>('2글자 이상 지어야해요.');

  const len = nickname.trim().length;

  const validateNickname = useCallback((v: string) => {
    const n = v.trim();
    if (n.length < 2) return '2글자 이상 지어야해요.';
    // 필요하면 허용문자/길이 제한 추가:
    // if (!/^[a-zA-Z0-9가-힣_.-]{2,16}$/.test(n)) return '2~16자, 한글/영문/숫자/._-만 사용 가능해요.';
    return null;
  }, []);

  const saveNickname = useCallback(async (n: string) => {
    const accessToken = localStorage.getItem('accessToken') || '';
    const resp = await api.patch<ApiResponse<Profile>>(
      '/my/profile/nickname',
      { nickname: n.trim() },
      {
        headers: {
          Accept: 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      }
    );
    return resp.data;
  }, []);

  const handleNext = useCallback(async () => {
    const err = validateNickname(nickname);
    if (err) {
      setAlertMsg(err);
      setShowAlert(true);
      return;
    }

    if (saving) return;
    setSaving(true);
    try {
      const res = await saveNickname(nickname);
      if (res?.success) {
        // 로컬에도 최신 닉네임을 반영하고 싶다면:
        try {
          const newNick = res.data?.nickname ?? nickname.trim();
          localStorage.setItem('nickname', newNick);
        } catch {}
        navigate('/register/3', { replace: true });
      } else {
        const msg =
          (res as any)?.error?.message ||
          (res as any)?.message ||
          '닉네임 저장 중 문제가 발생했어요.';
        setAlertMsg(msg);
        setShowAlert(true);
      }
    } catch (e: any) {
      const status = e?.response?.status as number | undefined;
      const serverMsg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        e?.message;

      // 자주 나오는 케이스 핸들링
      if (status === 401) {
        // 토큰 만료 등 → 홈으로
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setAlertMsg('세션이 만료되어 다시 로그인해 주세요.');
        setShowAlert(true);
        navigate('/', { replace: true });
        return;
      }
      if (status === 409) {
        setAlertMsg('이미 사용 중인 닉네임이에요.');
        setShowAlert(true);
        return;
      }

      setAlertMsg(serverMsg || '네트워크/서버 오류가 발생했어요.');
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  }, [nickname, navigate, saveNickname, saving, validateNickname]);

  return (
    <div className="relative min-h-screen bg-beige3 flex flex-col px-6 py-8">
      {/* 진행 바 */}
      <div className="mx-auto mb-4 h-2 w-11/12 rounded-full bg-gray2" />

      {/* 타이틀 이미지 */}
      <div className="mb-1">
        <img
          src={NickTitle}
          alt="닉네임을 지어주세요!"
          className="w-full max-w-[320px] h-auto"
        />
      </div>
      <p className="mb-8 text-body1 text-green-muted">Create your nickname.</p>

      {/* 입력 */}
      <label className="mb-2 text-caption3 text-black">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleNext();
        }}
        placeholder="닉네임 입력"
        className="
          mb-2 w-full rounded-l border border-gray1 bg-white
          px-4 py-3 text-body1 text-black placeholder:text-gray1
          focus:outline-none focus:ring-2 focus:ring-green2
        "
      />
      <div className="mb-6 text-caption2 text-green-muted">{len}/16</div>

      {/* 다음 */}
      <div className="mt-auto w-full">
        <Button
          variant="lg"
          color="green3"
          className="w-full"
          onClick={handleNext}
          disabled={saving || len === 0}
          aria-label="다음 단계로 이동"
        >
          {saving ? '저장 중…' : '다음'}
        </Button>
      </div>

      {/* 알림 */}
      {showAlert && (
        <div className="absolute left-4 right-4 bottom-24">
          <Alert onClose={() => setShowAlert(false)} className="rounded-l shadow-md">
            {alertMsg}
          </Alert>
        </div>
      )}
    </div>
  );
}
