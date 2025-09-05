import React from 'react';
import { X } from 'react-feather';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right'; 
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, position = 'right' }) => {
  const isLeft = position === 'left';
  const navigate=useNavigate();

  return (
    <>
    <div
        className={`fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

    <div
      className={`fixed top-0 ${isLeft ? 'left-0' : 'right-0'} z-[70] h-full w-50 transform bg-beige3 ${
        isOpen ? 'translate-x-0' : isLeft ? '-translate-x-full' : 'translate-x-full'
      } z-50 transition-transform duration-300`}
    >
      {/* 닫기 버튼 */}
      <div className="flex justify-end p-3.5">
        <X className="h-4.5 w-4.5 cursor-pointer text-green2" onClick={onClose} />
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex flex-col gap-1 pl-7 text-title5 text-green1">
        <div className='border-b mr-13 border-gray1'/>
        <button onClick={()=>navigate("/")} className="py-2 text-left cursor-pointer">
          홈
        </button>
        <div className='border-b mr-13 border-gray1'/>
        <button onClick={()=>navigate("/explore")} className="py-2 text-left cursor-pointer">
          AI 맞춤 여행지 탐색
        </button>
        <div className='border-b mr-13 border-gray1'/>
        <button onClick={()=>navigate("/search")} className="py-2 text-left cursor-pointer">
          여행지 검색
        </button>
        <div className='border-b mr-13 border-gray1'/>
        <button onClick={()=>navigate("/mytravel")} className="py-2 text-left cursor-pointer">
          나의 여행지
        </button>
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
