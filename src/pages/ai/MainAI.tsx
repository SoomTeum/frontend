import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabeledInput, Button, Header, Sidebar } from '@/component';
import { useAIExploreStore } from '@/stores/useAIExploreStore';
import DistanceSlider from '@/component/ai_explore/DistanceSlider';
import { AddressSearchModal } from '@/component/KakaoMap/AddressPickerModal';
import { getAIPlaces } from '@/api/List/aiList.api';
import { geocodeAddress } from '@/utils/geocode';
import AILoadingPage from './AILoadingPage';

export default function AiExplorePage() {
  const navigate = useNavigate();
  const address = useAIExploreStore((s) => s.address);
  const theme = useAIExploreStore((s) => s.theme);
  const themeCodes = useAIExploreStore((s) => s.themeCodes);
  const distanceKm = useAIExploreStore((s) => s.distanceKm);
  const setAddress = useAIExploreStore((s) => s.setAddress);
  const setDistanceKm = useAIExploreStore((s) => s.setDistanceKm);

  const isReady = useMemo(
    () => !!address && !!theme?.subs.length && distanceKm !== 0 && distanceKm !== null,
    [address, theme, distanceKm],
  );

  const goThemeSelect = () => navigate('/explore/theme');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const fillSampleAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressSelect = (selectedAddress: any) => {
    setAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  const startSearch = async () => {
    if (!address || !distanceKm) return;

    try {
      setLoading(true);

      const { lat, lng } = await geocodeAddress(address);

      const cat1 = themeCodes.cat1;
      const cat2 = themeCodes.cat2?.[0];

      const radiusMeters = Math.round(Number(distanceKm) * 1000);

      console.log('API 호출 파라미터:', {
        mapX: lng,
        mapY: lat,
        radius: radiusMeters,
        cat1,
        cat2,
        arrange: 'S',
        pageNo: 1,
        numOfRows: 20,
      });

      const places = await getAIPlaces({
        mapX: lng,
        mapY: lat,
        radius: radiusMeters,
        cat1: cat1 ?? undefined,
        cat2: cat2 ?? undefined,
        arrange: 'S',
        pageNo: 1,
        numOfRows: 20,
      });

      navigate('/explore/result', {
        state: { places },
      });
    } catch (e) {
      console.error('API 에러:', e);
      alert('추천지를 불러오지 못했습니다. 잠시 후에 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <AILoadingPage />;

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />

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
                disabled={!isReady || loading}
                onClick={startSearch}
              >
                {loading ? '탐색 중...' : 'AI 탐색 시작하기'}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelect={handleAddressSelect}
        currentAddress={address}
      />
    </div>
  );
}
