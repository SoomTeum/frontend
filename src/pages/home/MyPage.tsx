import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import { User } from "react-feather";
// import api from "@/api"; // 서버 로그아웃 API 있으면 주석 해제

const MyPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // (선택) 서버 로그아웃 엔드포인트 호출
      // await api.post("/auth/logout");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // ✅ / → 홈으로 이동
      navigate("/", { replace: true });
      // 또는 강제 새로고침 원하면 ↓
      // window.location.href = "/";
    } catch (e) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF5]">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />

      {/* 사용자 정보 */}
      <div className="mt-[3.5rem] bg-green-100 px-4 py-4 text-center text-sm text-green-900">
        <p className="font-semibold">안녕하세요 여행자님!</p>
        <p className="text-green-900">breathtrip@naver.com</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-2 rounded border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs text-green-800 disabled:opacity-60"
        >
          {loggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      {/* 개인정보 입력 */}
      <div className="mt-8 flex flex-col gap-6 px-6 text-gray-700">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value="breathtrip@naver.com"
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
            defaultValue="여행자"
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <button className="mt-2 self-start text-sm text-red-600">회원 탈퇴</button>
      </div>

      {/* 플로팅 유저 아이콘 */}
      <div className="fixed right-4 bottom-4 rounded-full bg-white p-2 shadow-lg">
        <User className="text-blue-600" size={28} />
      </div>
    </div>
  );
};

export default MyPage;
