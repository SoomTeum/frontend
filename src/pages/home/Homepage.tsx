import HomeBanner from '@/assets/icons/home_banner.jpg';
import { Header, Sidebar, Image, Button } from '@/component';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />{' '}
      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <Image src={HomeBanner} className="h-60 w-full" />
        <div className="text-caption2 text-green1 px-5 pt-1 text-right">
          *해당 사진 속 장소는 강릉입니다.
        </div>
        <div className="px-5 pt-4 pb-6 text-center">
          <div className="text-title2 text-green1">혼잡한 도시는 이제 그만</div>
          <div className="text-title5 text-green1 pt-1">
            지금 가장 여유롭고 한적한 여행지를 찾아드립니다.
          </div>
          <Button variant="sm" className="mt-3" onClick={() => navigate('/explore')}>
            바로가기
          </Button>
        </div>
        {/*Todo: 추후 홈 메인 내용 확정 되면 구현....*/}
      </div>
    </div>
  );
}
