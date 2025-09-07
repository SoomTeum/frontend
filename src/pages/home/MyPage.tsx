import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api-response";

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

  const [editMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    } finally {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get<ApiResponse<Profile>>("/my/profile/");
        const res = resp.data;
        if (!cancelled) {
          if (res?.success && res.data) {
            setProfile(res.data);
            setNewNickname(res.data.nickname ?? "");
          } else {
            setError((res as any)?.error?.message || "프로필 정보를 불러오지 못했습니다.");
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status as number | undefined;
        if (status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/", { replace: true });
          return;
        }
        setError(
          err?.response?.data?.error?.message ||
            err?.message ||
            "프로필 조회 중 오류가 발생했습니다."
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

  const email = profile?.email || "";
  const nickname = profile?.nickname || "";

  const handleSaveNickname = async () => {
    if (saving) return;
    setSaveMsg(null);

    const value = (newNickname ?? "").trim();
    if (value.length < 2) {
      setSaveMsg("닉네임은 2글자 이상이어야 합니다.");
      return;
    }

    setSaving(true);
    try {
      const resp = await api.patch<ApiResponse<Profile>>(
        "/my/profile/nickname"
      );
      const res = resp.data;

      if (res?.success && res.data) {
        setProfile((prev) =>
          prev ? { ...prev, nickname: res.data?.nickname ?? value } : res.data
        );
        setNewNickname(res.data?.nickname ?? value);
        setEditMode(false);
        setSaveMsg("닉네임이 저장되었습니다.");
        try {
          localStorage.setItem("nickname", res.data?.nickname ?? value);
        } catch {}
      } else {
        const msg =
          (res as any)?.error?.message ||
          (res as any)?.message ||
          "닉네임 저장 중 문제가 발생했습니다.";
        setSaveMsg(msg);
      }
    } catch (err: any) {
      const status = err?.response?.status as number | undefined;
      if (status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/", { replace: true });
        return;
      }
      if (status === 409) {
        setSaveMsg("이미 사용 중인 닉네임입니다.");
        return;
      }
      setSaveMsg(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "닉네임 저장 중 오류가 발생했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-beige3">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />
      <div className="mt-[3.5rem] px-4 py-4 text-center bg-green3-light text-green2">
        {loading ? (
          <p className="font-semibold">마이페이지 불러오는 중…</p>
        ) : error ? (
          <>
            <p className="font-semibold">오류: {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 rounded-m border px-3 py-1 text-caption2 bg-beige2 text-green1 border-gray1"
            >
              다시 시도
            </button>
          </>
        ) : (
          <>
            <p className="font-semibold">
              안녕하세요 {nickname ? `${nickname}님` : "여행자님"}!
            </p>
            <p>{email || "이메일 정보 없음"}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-m border px-3 py-1 text-caption2 bg-beige2 text-green1 border-gray1 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              로그아웃
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-6 px-6 text-green1">
        <div>
          <label htmlFor="email" className="mb-1 block text-title4 text-green1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full rounded-m border border-gray2 bg-white px-3 py-2 text-body1"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="mb-1 block text-title4 text-green1">
            닉네임
          </label>

          {!editMode ? (
            <div className="flex items-center gap-2">
              <input
                id="nickname"
                type="text"
                value={nickname}
                readOnly
                className="w-full rounded-m border border-gray1 bg-white px-3 py-2 text-body1"
              />
              
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                id="nickname-edit"
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveNickname();
                }}
                className="w-full rounded-m border border-gray1 bg-white px-3 py-2 text-body1"
                placeholder="새 닉네임 입력"
              />
              
            </div>
          )}

          {saveMsg && <p className="mt-2 text-caption2 text-green-muted">{saveMsg}</p>}
        </div>
      </div>

      <button
        type="button"
        disabled
        aria-disabled
        title="UI 데모 — 기능 비활성화"
        className="fixed right-4 bottom-20 z-50 text-caption2 font-medium text-black underline-offset-2 hover:underline disabled:no-underline disabled:opacity-60"
      >
        회원 탈퇴
      </button>
    </div>
  );
}
