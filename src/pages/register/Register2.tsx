// src/pages/register/Register2.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/component/common/Button/Button';
import Alert from '@/component/common/Alert/Alert';
import api from '@/api/api';
import type { ApiResponse } from '@/types/api-response';
import { useAlertQueue } from '@/stores/useAlertQueue';

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
  const { alerts, addAlert, removeAlert } = useAlertQueue();

  const len = nickname.trim().length;

  const validateNickname = useCallback((v: string) => {
    const n = v.trim();
    if (n.length < 2) return '2글자 이상 지어야해요.';
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
      },
    );
    return resp.data;
  }, []);

  const handleNext = useCallback(async () => {
    const err = validateNickname(nickname);
    if (err) {
      addAlert(err);
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
        } catch {
          navigate('/register/3', { replace: true });
        }
      } else {
        const msg =
          (res as any)?.error?.message ||
          (res as any)?.message ||
          '닉네임 저장 중 문제가 발생했어요.';
        addAlert(msg);
      }
    } catch (e: any) {
      const status = e?.response?.status as number | undefined;
      const serverMsg =
        e?.response?.data?.error?.message || e?.response?.data?.message || e?.message;

      // 자주 나오는 케이스 핸들링
      if (status === 401) {
        // 토큰 만료 등 → 홈으로
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        addAlert('세션이 만료되어 다시 로그인해 주세요.');
        navigate('/', { replace: true });
        return;
      }
      if (status === 409) {
        addAlert('이미 사용 중인 닉네임이에요.');
        return;
      }

      addAlert(serverMsg || '네트워크/서버 오류가 발생했어요.');
    } finally {
      setSaving(false);
    }
  }, [nickname, navigate, saveNickname, saving, validateNickname, addAlert]);

  return (
    <div className="bg-beige3 relative flex min-h-screen flex-col py-8">
      {/* 진행 바 */}
      <div className="bg-gray2 mx-auto mb-4 h-2 w-5/6 rounded-full" />

      {/* 타이틀 이미지 */}
      <div className="px-8">
        <div className="pt-3 pb-2">
          <div className="text-title3 text-green1">닉네임을 지어주세요!</div>
        </div>
        <p className="text-body1 text-green-muted mb-8">Create your nickname.</p>

        {/* 입력 */}
        <label className="text-caption3 mb-2 text-black">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNext();
          }}
          placeholder="닉네임 입력"
          className="border-green3 text-body1 placeholder:text-gray1 mb-2 w-full rounded-l border bg-white px-4 py-3 text-black focus:outline-none"
        />
        <div className="text-caption2 text-green-muted mb-6">{len}/16</div>

        {/* 다음 */}
        <div className="fixed right-0 bottom-[28px] left-0 mx-auto w-full max-w-[430px] px-8">
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
        {alerts.length > 0 && (
          <div
            className="pointer-events-none absolute right-4 bottom-24 left-4 flex flex-col gap-2 px-3"
            aria-live="polite"
          >
            {alerts.map((a: any) => (
              <div key={a.id} className="pointer-events-auto">
                <Alert onClose={() => removeAlert(a.id)} className="rounded-l shadow-md">
                  {a.message}
                </Alert>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
