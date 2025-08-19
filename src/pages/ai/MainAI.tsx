import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, Button, Header, Sidebar } from '@/component';
import { useAIExploreStore } from '@/stores/useAIExploreStore';
import DistanceSlider from '@/component/ai_explore/DistanceSlider';

export default function AiExplorePage() {
  const navigate = useNavigate();
  const address = useAIExploreStore((s) => s.address);
  const theme = useAIExploreStore((s) => s.theme);
  const distanceKm = useAIExploreStore((s) => s.distanceKm);
  const setAddress = useAIExploreStore((s) => s.setAddress);
  const setDistanceKm = useAIExploreStore((s) => s.setDistanceKm);

  const isReady = useMemo(
    () => !!address && !!theme?.subs.length && distanceKm !== null,
    [address, theme, distanceKm],
  );

  const fillSampleAddress = () => {
    setAddress('경기도 성남시 수정구 성남대로 1342 이렇게 길어지면'); // UI 확인용입니당... 추후 API 연결
  };

  const goThemeSelect = () => navigate('/explore/theme');

  const startSearch = () => navigate('/explore/result');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />{' '}
      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          AI 맞춤 여행지 탐색
        </div>
        <div className="text-body1 text-green-muted mx-auto w-full pt-2 text-center">
          내 취향에 맞는 한적한 근교 여행지를 추천해요!
        </div>
        <section className="px-5 pb-8">
          <div className="mt-4 p-4">
            <LabeledInput
              label="출발지"
              value={address}
              placeholder="현재 위치 불러오기"
              onClick={fillSampleAddress}
            />

            <LabeledInput
              label="테마"
              value={theme?.subs?.length ? theme.subs.join(', ') : undefined}
              placeholder="테마 선택"
              onClick={goThemeSelect}
            />

            <DistanceSlider value={distanceKm} onChange={setDistanceKm} />

            <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
              <Button
                variant="lg"
                color="green3"
                className="w-full"
                disabled={!isReady}
                onClick={startSearch}
              >
                AI 탐색 시작하기
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
