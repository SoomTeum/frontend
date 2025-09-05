import { Menu, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Logo from '../image/Logo.png';

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-beige3 fixed top-0 right-0 left-0 z-50 mx-auto flex h-14 w-full max-w-[430px] items-center justify-between">
      <div className="flex w-full flex-row items-center justify-between px-4 py-3">
        {/* 왼쪽: 메뉴(햄버거) 아이콘 */}
        <Menu className="h-7 w-7 cursor-pointer text-green-700" onClick={onMenuClick} />

        {/* 가운데: 로고 이미지 */}
        <div className="flex flex-1 justify-center">
          <img
            src={Logo}
            alt="logo"
            className="h-8 cursor-pointer object-contain"
            onClick={() => navigate('/')}
          />
        </div>

        {/* 오른쪽: 사람 아이콘 */}
        <User
          className="h-7 w-7 cursor-pointer text-green-700"
          onClick={() => navigate('/mypage')}
        />
      </div>
    </header>
  );
}
