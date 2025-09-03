import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import { LogOut, User } from "react-feather"; // ← 아이콘 하나 추가
import api from "@/api/api.ts";

type ProfileResponse = {
  success: boolean;
  data?: { email: string; nickname: string };
  error?: {
    code: string;
    status: number;
    message: string;
    path?: string;
    timestamp?: string;
    detail?: string;
  };
};

// ================== 디버깅 유틸 ==================
const DEBUG = (import.meta as any)?.env?.VITE_DEBUG !== "false";
const dlog = (...args: any[]) => DEBUG && console.log("[MyPage]", ...args);
const derr = (...args: any[]) => DEBUG && console.error("[MyPage][ERROR]", ...args);

const maskToken = (t?: string | null) =>
  t ? `${t.slice(0, 10)}...(${t.length})` : "(none)";

const group = (title: string, fn: () => void) => {
  if (!DEBUG) return fn();
  const hasGroup = !!console.groupCollapsed;
  try {
    hasGroup ? console.groupCollapsed(`[MyPage] ${title}`) : dlog(title);
    fn();
  } finally {
    hasGroup && console.groupEnd && console.groupEnd();
  }
};

function decodeJwt(token?: string | null): Record<string, any> | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    derr("JWT decode 실패", e);
    return null;
  }
}
// =================================================

const MyPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const navigate = useNavigate();

  const accessToken = useMemo(() => localStorage.getItem("accessToken"), []);
  const jwtClaims = useMemo(() => decodeJwt(accessToken), [accessToken]);
  const resolvedUserId = useMemo(() => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;
    if (!jwtClaims) return null;
    if (jwtClaims.userId) return String(jwtClaims.userId);
    if (jwtClaims.sub) return String(jwtClaims.sub);
    return null;
  }, [jwtClaims]);

  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      derr("Unhandled rejection", e.reason);
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // localStorage.removeItem("userId");
      dlog("로그아웃 완료 → /");
      navigate("/", { replace: true });
    } catch (e) {
      derr("로그아웃 실패(토큰만 제거 후 홈 이동)", e);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  // ✅ 마이프로필 조회
  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setLoadError(null);

      group("fetchProfile 준비 상태", () => {
        console.table({
          hasToken: !!accessToken,
          tokenMasked: maskToken(accessToken),
          tokenLen: accessToken?.length || 0,
          resolvedUserId: resolvedUserId ?? "(null)",
        });
        if (jwtClaims) {
          dlog("JWT claims 요약", {
            sub: jwtClaims?.sub,
            userId: jwtClaims?.userId,
            exp: jwtClaims?.exp,
            iat: jwtClaims?.iat,
          });
        } else {
          dlog("JWT claims 없음/디코드 실패");
        }
      });

      if (!accessToken) {
        setLoading(false);
        setLoadError("인증 정보가 없습니다. 다시 로그인해주세요.");
        dlog("중단: accessToken 없음");
        return;
      }
      if (!resolvedUserId) {
        setLoading(false);
        setLoadError("userId를 확인할 수 없습니다.");
        dlog("중단: resolvedUserId 없음");
        return;
      }

      const url = `/my/profile/${resolvedUserId}`;
      const startedAt = performance.now();

      group("API 요청", () => {
        console.table({
          method: "GET",
          url,
          Authorization: `Bearer ${maskToken(accessToken)}`,
        });
      });

      try {
        const { data, status, headers } = await api.get<ProfileResponse>(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const tookMs = Math.round(performance.now() - startedAt);
        group("API 응답", () => {
          console.table({
            status,
            tookMs: `${tookMs}ms`,
            "content-length": headers?.["content-length"] || "(n/a)",
          });
          dlog("응답 data 요약", {
            success: (data as any)?.success,
            hasData: !!(data as any)?.data,
            hasError: !!(data as any)?.error,
          });
        });

        if (cancelled) return;

        if (data?.success && data.data) {
          setEmail(data.data.email ?? "");
          setNickname(data.data.nickname ?? "");
        } else {
          const msg =
            data?.error?.message ||
            data?.error?.detail ||
            "프로필 정보를 불러오지 못했습니다.";
          setLoadError(msg);
          derr("API 성공=false", data?.error || data);
        }
      } catch (err: any) {
        if (cancelled) return;

        const tookMs = Math.round(performance.now() - startedAt);
        const status = err?.response?.status;
        const body = err?.response?.data;
        const code = err?.code;
        const method = err?.config?.method;
        const reqUrl = err?.config?.url;

        group("API 예외", () => {
          console.table({
            method,
            reqUrl,
            status: status ?? "(none)",
            code: code ?? "(none)",
            tookMs: `${tookMs}ms`,
          });
          if (body?.error?.message || body?.message) {
            dlog("에러 메시지", body?.error?.message || body?.message);
          } else {
            dlog("에러 바디(요약)", body ? Object.keys(body) : "(없음)");
          }
        });

        if (!status && code === "ERR_NETWORK") {
          setLoadError("서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.");
        } else if (status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/", { replace: true });
          return;
        } else if (status === 404) {
          setLoadError("요청한 리소스를 찾을 수 없습니다. 경로를 확인해주세요.");
        } else if (status === 500) {
          setLoadError(body?.error?.message || body?.message || "서버 내부 오류가 발생했습니다.");
        } else {
          setLoadError(
            body?.error?.message || err?.message || "프로필 조회 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [accessToken, resolvedUserId, jwtClaims, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF5]">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />

      {/* 상단 알림 영역 */}
      <div className="mt-[3.5rem] bg-green-100 px-4 py-4 text-center text-sm text-green-900">
        {loading ? (
          <p className="font-semibold">마이페이지 불러오는 중…</p>
        ) : loadError ? (
          <>
            <p className="font-semibold">오류: {loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs text-green-800"
            >
              다시 시도
            </button>
          </>
        ) : (
          <>
            <p className="font-semibold">
              안녕하세요 {nickname ? `${nickname}님` : "여행자님"}!
            </p>
            <p className="text-green-900">{email || "이메일 정보 없음"}</p>
            {/* 기존 위치의 로그아웃 버튼은 유지(원하면 제거 가능) */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-2 rounded border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs text-green-800 disabled:opacity-60"
            >
              {loggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </>
        )}
      </div>

      {/* 개인정보 폼 */}
      <div className="mt-8 flex flex-col gap-6 px-6 text-gray-700">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="mb-1 block text-sm font-semibold">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            readOnly
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <button className="mt-2 self-start text-sm text-red-600">회원 탈퇴</button>
      </div>

      {/* 플로팅 유저 아이콘 */}
      <div className="fixed right-4 bottom-4 rounded-full bg-white p-2 shadow-lg">
        <User className="text-blue-600" size={28} />
      </div>

      {/* ✅ 항상 보이는 플로팅 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="로그아웃"
        className="fixed right-4 bottom-20 z-50 rounded-full px-4 py-2 shadow-lg
                   bg-red-500 text-white text-sm font-semibold disabled:opacity-60
                   hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center gap-2"
      >
        <LogOut size={18} />
        {loggingOut ? "로그아웃 중…" : "로그아웃"}
      </button>
    </div>
  );
};

export default MyPage;
