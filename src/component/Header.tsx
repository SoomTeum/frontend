import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Home } from 'react-feather';

type HeaderProps = {
  onMenuClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
      {/* 로고 영역 */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        <span className="font-bold text-lg">숨여행, 틈</span>
      </div>

      {/* 아이콘 영역 */}
      <div className="flex items-center gap-4">
        <User
          className="w-6 h-6 text-green-700 cursor-pointer"
          onClick={() => navigate('/mypage')}
        />
        <Home
          className="w-6 h-6 text-green-700 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <Menu
          className="w-6 h-6 text-green-700 cursor-pointer"
          onClick={onMenuClick}
        />
      </div>
    </header>
  );
};

export default Header;
