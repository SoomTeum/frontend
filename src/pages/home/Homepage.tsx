import { MainImage1, MainImage2 } from '@/assets';
import HomeBanner from '@/assets/icons/home_banner.jpg';
import { Header, Sidebar, Image, Button } from '@/component';
import Footer from '@/component/common/Footer/Footer';
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
      <div className="mx-auto flex w-full flex-col pt-14">
        <Image src={HomeBanner} className="h-60 w-full" />
        <div className="text-caption2 text-green1 px-5 pt-2 text-right">
          *해당 사진 속 장소는 강릉입니다.
        </div>
        <div className="px-5 pt-5 pb-38 text-center">
          <div className="text-title2 text-green1">혼잡한 도시는 이제 그만</div>
          <div className="text-title5 text-green1 pt-1">
            지금 가장 여유롭고 한적한 여행지를 찾아드립니다.
          </div>
          <Button variant="sm" className="mt-3 cursor-pointer" onClick={() => navigate('/explore')}>
            바로가기
          </Button>
        </div>
        {/*메인 카드: 관광지 탐색*/}
        <div className="relative isolate px-5 pb-38 after:absolute after:top-20 after:left-1/2 after:-z-10 after:h-[180px] after:w-[170px] after:-translate-x-1/2 after:rounded-[9999px] after:bg-[radial-gradient(ellipse_at_center,_rgba(227,235,212,0.99)_0%,_rgba(227,235,212,0.9)_95%)] after:blur-2xl after:content-['']">
          <div className="mx-auto w-full max-w-[200px] text-center">
            <MainImage1 className="z-10 mx-auto justify-center" />
            <div className="text-title2 text-green1">관광지 탐색</div>
            <div className="text-body1 mt-4 text-black">
              원하는 분위기, 가고 싶은 지역의
              <br /> 조용한 여행지를 찾아보세요.
            </div>
            <div className="text-body1 mt-4 text-black">
              내가 원하는 조용한 여행지,
              <br /> 이제 손쉽게 찾을 수 있어요.
            </div>
            <Button
              variant="sm"
              className="mt-5 cursor-pointer"
              onClick={() => navigate('/search')}
            >
              바로가기
            </Button>
          </div>
        </div>
        {/*메인 카드: AI 탐색*/}
        <div className="relative isolate px-5 pb-38 after:absolute after:top-20 after:left-1/2 after:-z-10 after:h-[230px] after:w-[170px] after:-translate-x-1/2 after:rounded-[9999px] after:bg-[radial-gradient(ellipse_at_center,_rgba(227,235,212,0.99)_0%,_rgba(227,235,212,0.9)_95%)] after:blur-2xl after:content-['']">
          <div className="mx-auto w-full max-w-[200px] text-center">
            <MainImage2 className="z-10 mx-auto justify-center" />
            <div className="text-title2 text-green1">AI 맞춤 여행지 찾기</div>
            <div className="text-caption4 text-green1 mt-4">1. 정보 입력하기</div>
            <div className="text-body3 text-green-muted">출발지, 테마, 거리를 입력해주세요</div>
            <div className="text-caption4 text-green1 mt-4">2. AI 분석 중!</div>
            <div className="text-body3 text-green-muted">
              입력한 정보를 바탕으로
              <br />
              AI가 딱 맞는 여행지를 찾고 있어요.
            </div>
            <div className="text-caption4 text-green1 mt-4">3. 추천 결과 확인</div>
            <div className="text-body3 text-green-muted">
              딱 맞는 여행지의 상세정보와 실제 후기
              <br />
              주차장 위치까지 한눈에 확인해보세요.
            </div>
            <Button
              variant="sm"
              className="mt-5 cursor-pointer"
              onClick={() => navigate('/explore')}
            >
              바로가기
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
