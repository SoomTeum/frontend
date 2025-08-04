import { Menu, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Logo from '../image/Logo.png'; 

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#f8fbe9] border-b border-gray-200">
      <div className="w-full flex flex-row items-center justify-between px-4 py-2">
        {/* 왼쪽: 메뉴(햄버거) 아이콘 */}
        <Menu
          className="w-7 h-7 text-green-700 cursor-pointer"
          onClick={onMenuClick}
        />

        {/* 가운데: 로고 이미지 */}
        <div className="flex-1 flex justify-center">
          <img
            src={Logo}
            alt="logo"
            className="h-8 object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* 오른쪽: 사람 아이콘 */}
        <User
          className="w-7 h-7 text-green-700 cursor-pointer"
          onClick={() => navigate('/mypage')}
        />
      </div>
    </header>
  );
}
