import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Progressbar from "@/component/Progressbar";
import RegionSelectorRaw from '@/component/selector/RegionSelector';
import TravelActivitySelectorRaw from '@/component/selector/TravelActivitySelector';

//import { activityMap } from '@/constants/ActivityMap';

type Pair = { left?: string; right?: string };

type AdapterProps = { onSelect?: (v: Pair) => void };

const RegionSelector: React.FC<AdapterProps> = ({ onSelect }) => (
  <RegionSelectorRaw {...({ onSelect } as any)} />
);

const TravelActivitySelector: React.FC<AdapterProps> = ({ onSelect }) => (
  <TravelActivitySelectorRaw {...({ onSelect } as any)} />
);

export default function Filter() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  const [region, setRegion] = useState<Pair>({});
  const [activity, setActivity] = useState<Pair>({});

  // 단계 바뀔 때 스크롤 상단
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // 지역 바꾸면 활동 초기화
  useEffect(() => {
    setActivity({});
  }, [region.left, region.right]);

  const next = () => setStep(2);
  const prev = () => setStep(1);

  // 완료 버튼 활성화: 카테고리/세부 모두 선택 시
  const canFinish = Boolean(activity.left && activity.right);

  return (
   < div className="min-h-screen bg-white flex flex-col">
     {/* 헤더 */}
<div className="px-4 py-3 flex items-center justify-center bg-[#eaf3e1] text-[#3d4c3b]">
  <span className="text-lg font-semibold">여행탐색기</span>
  {/* X 버튼을 오른쪽에 배치 */}
  <button
    onClick={() => navigate(-1)}
    className="absolute right-4 text-xl font-bold text-[#3d4c3b]"
  >
    ✕
  </button>
</div>

{/* 진행 바 (헤더와 간격 추가) */}
<div className="px-4 pt-3 pb-2">
      <Progressbar progress={step === 1 ? 0.5 : 1} />
    </div>

      {/* 본문 */}
      <div className="flex-1 px-5 py-6">
        {step === 1 ? (
          <>
            <h2 className="text-base font-semibold mb-4">1단계: 지역을 골라주세요.</h2>
            <div className="bg-white rounded-2xl shadow p-3 border border-[#f3d7b7]">
              <RegionSelector onSelect={setRegion} />
            </div>

            {/* 항상 활성화 */}
            <button
              className="w-full h-12 rounded-xl font-semibold mt-6 bg-[#7da453] text-white"
              onClick={next}
            >
              다음
            </button>
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold mb-4">2단계: 테마를 골라주세요.</h2>
            <div className="bg-white rounded-2xl shadow p-3 border border-[#f3d7b7]">
              <TravelActivitySelector onSelect={setActivity} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="h-12 rounded-xl font-semibold bg-[#4b4b4b] text-white"
                onClick={prev}
              >
                이전
              </button>
              <button
                className={`h-12 rounded-xl font-semibold ${
                  canFinish ? 'bg-[#7da453] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => navigate('/explore/loading', { state: { region, activity } })}
                disabled={!canFinish}
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
