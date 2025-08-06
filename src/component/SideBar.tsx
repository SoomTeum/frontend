import React from 'react';
import { X } from 'react-feather';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right'; // ✅ 추가: 왼쪽/오른쪽 위치 결정
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  position = 'right',
}) => {
  const isLeft = position === 'left';

  return (
    <div
      className={`fixed top-0 ${isLeft ? 'left-0' : 'right-0'} h-full w-64 bg-[#f8fbe9] shadow-lg transform ${
        isOpen
          ? 'translate-x-0'
          : isLeft
          ? '-translate-x-full'
          : 'translate-x-full'
      } transition-transform duration-300 z-50`}
    >
      {/* 닫기 버튼 */}
      <div className="flex justify-end p-4">
        <X
          className="w-6 h-6 text-green-700 cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex flex-col gap-4 px-6">
        <a href="/ai" className="border-b border-gray-300 py-2">
          AI 맞춤 여행지 탐색
        </a>
        <a href="/search" className="border-b border-gray-300 py-2">
          여행지 검색
        </a>
        <a href="/community" className="border-b border-gray-300 py-2">
          커뮤니티
        </a>
        <a href="/mytravel" className="border-b border-gray-300 py-2">
          나의 여행지
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
