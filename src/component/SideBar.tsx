import React from "react";
import { X } from "react-feather";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  position = "right",
}) => {
  const isLeft = position === "left";
  const navigate = useNavigate();

  // ✅ 로그인 여부 체크 함수
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // ✅ 안전한 라우팅 함수
  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
    onClose(); // 사이드바 닫기
  };

  return (
    <div
      className={`fixed top-0 ${
        isLeft ? "left-0" : "right-0"
      } h-full w-64 transform bg-[#f8fbe9] shadow-lg ${
        isOpen
          ? "translate-x-0"
          : isLeft
          ? "-translate-x-full"
          : "translate-x-full"
      } z-50 transition-transform duration-300`}
    >
      {/* 닫기 버튼 */}
      <div className="flex justify-end p-4">
        <X
          className="h-6 w-6 cursor-pointer text-green-700"
          onClick={onClose}
        />
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex flex-col gap-4 px-6">
        <button
          onClick={() => navigate("/explore")}
          className="text-left border-b border-gray-300 py-2"
        >
          AI 맞춤 여행지 탐색
        </button>
        <button
          onClick={() => navigate("/search")}
          className="text-left border-b border-gray-300 py-2"
        >
          여행지 검색
        </button>
        <button
          onClick={() => handleNavigation("/community")}
          className="text-left border-b border-gray-300 py-2"
        >
          커뮤니티
        </button>
        <button
          onClick={() => handleNavigation("/mytravel")}
          className="text-left border-b border-gray-300 py-2"
        >
          나의 여행지
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
