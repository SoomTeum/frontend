// src/pages/explore/Filter.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Progressbar from '@/component/Progressbar';
import RegionSelectorRaw from '@/component/selector/RegionSelector';
import TravelActivitySelectorRaw from '@/component/selector/TravelActivitySelector';

type Pair = { left?: string; right?: string };
type Phase = 'select' | 'loading' | 'results';

function toPair(v: any): Pair {
  if (!v) return {};
  if (typeof v === 'string') return { left: v };
  if (Array.isArray(v)) return { left: v[0], right: v[1] };
  if ('left' in v || 'right' in v) return { left: v.left, right: v.right };
  const left =
    v?.sido ?? v?.group ?? v?.category ?? v?.parent ?? v?.main ?? v?.value ?? v?.key ?? v?.[0];
  const right =
    v?.sigungu ?? v?.theme ?? v?.sub ?? v?.child ?? v?.detail ?? v?.label ?? v?.[1];
  return { left, right };
}

type AdapterProps = { onSelect?: (v: Pair) => void };

const RegionSelector: React.FC<AdapterProps> = ({ onSelect }) => (
  <RegionSelectorRaw
    {...({
      onSelect: (v: any) => onSelect?.(toPair(v)),
    } as any)}
  />
);

const TravelActivitySelector: React.FC<AdapterProps> = ({ onSelect }) => (
  <TravelActivitySelectorRaw
    {...({
      onSelect: (v: any) => onSelect?.(toPair(v)),
    } as any)}
  />
);

type Place = {
  id: string | number;
  name: string;
  imageUrl?: string;
  sido?: string;
  sigungu?: string;
  tags?: string[];
  address?: string;
};

export default function Filter() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [phase, setPhase] = useState<Phase>('select');
  const [region, setRegion] = useState<Pair>({});
  const [activity, setActivity] = useState<Pair>({});
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, phase]);

  useEffect(() => {
    setActivity({});
  }, [region.left, region.right]);

  const next = () => setStep(2);
  const prev = () => setStep(1);

  const progress = useMemo(() => {
    if (phase === 'results') return 1;
    return step === 1 ? 0.5 : 1;
  }, [phase, step]);

  // ✅ 완료 → 항상 활성화, 무조건 Searching으로 이동
  function handleFinish() {
    navigate('/explore/Searching', { state: { region, activity } });
  }

  function resetAndSelectAgain() {
    setPhase('select');
    setStep(1);
    setResults([]);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 flex items-center justify-center bg-green3-light text-green1 relative">
        <span className="text-lg font-semibold">여행탐색기</span>
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 text-xl font-bold text-green1"
        >
          ✕
        </button>
      </div>

      {/* 진행 바 */}
      <div className="px-4 pt-3 pb-2">
        <Progressbar progress={progress} />
      </div>

      {/* 본문 */}
      <div className="flex-1 px-5 py-6">
        {phase === 'select' && (
          <>
            {step === 1 ? (
              <>
                <h2 className="text-base font-semibold mb-4 text-green1">1단계: 지역을 골라주세요.</h2>
                <div className="bg-white rounded-2xl shadow p-3 border border-green3">
                  <RegionSelector onSelect={setRegion} />
                </div>
                <button
                  className="w-full h-12 rounded-xl font-semibold mt-6 bg-green4 btn-text-white"
                  onClick={next}
                >
                  다음
                </button>
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold mb-4 text-green1">2단계: 테마를 골라주세요.</h2>
                <div className="bg-white rounded-2xl shadow p-3 border border-green3">
                  <TravelActivitySelector onSelect={setActivity} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    className="h-12 rounded-xl font-semibold bg-green-muted btn-text-white"
                    onClick={prev}
                  >
                    이전
                  </button>
                  <button
                    className="h-12 rounded-xl font-semibold bg-green4 btn-text-white"
                    onClick={handleFinish}
                  >
                    완료
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-pulse text-green1 font-semibold">
              여행지를 불러오는 중…
            </div>
          </div>
        )}

        {phase === 'results' && (
          <>
            <h2 className="text-base font-semibold mb-3 text-green1">탐색 결과</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {region.left && (
                <span className="px-3 py-1 rounded-full text-sm bg-green3-light text-green1 border border-green3">
                  지역: {region.left}
                  {region.right ? ` ${region.right}` : ''}
                </span>
              )}
              {activity.left && activity.right && (
                <span className="px-3 py-1 rounded-full text-sm bg-pink text-green1 border border-red2">
                  테마: {activity.left} / {activity.right}
                </span>
              )}
              <button
                onClick={resetAndSelectAgain}
                className="ml-auto px-3 py-1 rounded-full text-sm bg-gray2 hover:opacity-80"
              >
                다시 선택하기
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red2 bg-red2 px-3 py-2 text-sm text-white">
                {error}
              </div>
            )}
            {!error && results.length === 0 && (
              <div className="text-center text-gray1 py-16">
                조건에 맞는 여행지가 없어요. 필터를 바꿔보세요.
              </div>
            )}

            <ul className="grid grid-cols-1 gap-4">
              {results.map((p) => (
                <li
                  key={String(p.id ?? p.name)}
                  className="rounded-2xl border border-gray1 overflow-hidden shadow-sm"
                >
                  <div className="h-40 w-full bg-gray2">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray1">
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-green1">{p.name}</div>
                    <div className="mt-1 text-sm text-green-muted">
                      {(p.sido || p.sigungu) && `${p.sido ?? ''} ${p.sigungu ?? ''}`}
                    </div>
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full text-xs bg-blue btn-text-white"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
