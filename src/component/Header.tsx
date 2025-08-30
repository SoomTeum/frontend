import { Menu, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Logo from '../image/Logo.svg';

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleUserClick = () => {
    const token = localStorage.getItem('accessToken'); // ✅ 로그인 여부 확인
    if (token) {
      navigate('/mypage');  // 로그인 → 마이페이지
    } else {
      navigate('/login');   // 비로그인 → 로그인 페이지
    }
  };

  return (
    <header className="bg-beige3 fixed top-0 right-0 left-0 z-50 mx-auto flex h-14 w-full max-w-[430px] items-center justify-between">
      <div className="flex w-full flex-row items-center justify-between px-4 py-3">
        {/* 왼쪽: 메뉴(햄버거) 아이콘 */}
        <Menu
          className="h-7 w-7 cursor-pointer text-green-700"
          onClick={onMenuClick}
        />

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
          onClick={handleUserClick} // ✅ 조건부 이동
        />
      </div>
    </header>
  );
}
