import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import api from '@/api/api';
import type { ApiResponse } from '@/types/api-response';

type Profile = {
  userId: number;
  email: string;
  nickname: string;
};

export default function MyPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    } finally {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get<ApiResponse<Profile>>('/my/profile/');
        const res = resp.data;
        if (!cancelled) {
          if (res?.success && res.data) {
            setProfile(res.data);
            setNickname(res.data.nickname ?? '');
          } else {
            setError((res as any)?.error?.message || '프로필 정보를 불러오지 못했습니다.');
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status as number | undefined;
        if (status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/', { replace: true });
          return;
        }
        setError(
          err?.response?.data?.error?.message ||
            err?.message ||
            '프로필 조회 중 오류가 발생했습니다.',
        );
      } finally {
        !cancelled && setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const email = profile?.email || '';

  const handleSaveNickname = async () => {
    if (saving) return;
    setSaveMsg(null);

    const value = nickname.trim();
    if (value.length < 2) {
      setSaveMsg('닉네임은 2글자 이상이어야 합니다.');
      return;
    }

    setSaving(true);
    try {
      const resp = await api.patch<ApiResponse<Profile>>('/my/profile/nickname', {
        nickname: value,
      });
      const res = resp.data;

      if (res?.success && res.data) {
        setProfile((prev) =>
          prev ? { ...prev, nickname: res.data?.nickname ?? value } : res.data,
        );
        setNickname(res.data?.nickname ?? value);
        setSaveMsg('닉네임이 저장되었습니다.');
        try {
          localStorage.setItem('nickname', res.data?.nickname ?? value);
        } catch {}
      } else {
        const msg =
          (res as any)?.error?.message ||
          (res as any)?.message ||
          '닉네임 저장 중 문제가 발생했습니다.';
        setSaveMsg(msg);
      }
    } catch (err: any) {
      const status = err?.response?.status as number | undefined;
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/', { replace: true });
        return;
      }
      if (status === 409) {
        setSaveMsg('이미 사용 중인 닉네임입니다.');
        return;
      }
      setSaveMsg(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          '닉네임 저장 중 오류가 발생했습니다.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-beige3 flex min-h-screen flex-col">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />

      <div className="bg-green3-light text-green2 mt-[3.5rem] px-4 py-4 text-center">
        {loading ? (
          <p className="font-semibold">마이페이지 불러오는 중…</p>
        ) : error ? (
          <>
            <p className="font-semibold">오류: {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-m text-caption2 bg-beige2 text-green1 border-gray1 mt-2 border px-3 py-1"
            >
              다시 시도
            </button>
          </>
        ) : (
          <>
            <p className="text-caption1 text-black">
              안녕하세요 {nickname ? `${nickname}님` : '여행자님'}!
            </p>
            <p className="text-body1 text-green2">{email || '이메일 정보 없음'}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="text-caption2 bg-yellow2 text-green1 rounded-m mt-3 px-3.5 py-1 hover:brightness-95"
            >
              로그아웃
            </button>
          </>
        )}
      </div>

      <div className="text-green1 mt-6 flex flex-col gap-6 px-6">
        <div>
          <label htmlFor="email" className="text-title4 text-green1 mb-1 block">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="rounded-m border-gray2 text-body1 w-full border bg-white px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="text-title4 text-green1 mb-1 block">
            닉네임
          </label>
          <div className="flex items-center gap-2">
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="rounded-m border-gray1 text-body1 w-full border bg-white px-3 py-2"
              placeholder="닉네임 입력"
            />

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveNickname}
              className="rounded-m bg-green3-light text-caption3 text-green1 shrink-0 px-3.5 py-1.5 hover:brightness-95 disabled:opacity-60"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
          {saveMsg && <p className="text-caption2 text-green-muted mt-2">{saveMsg}</p>}
        </div>
      </div>
    </div>
  );
}
