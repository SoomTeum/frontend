// src/pages/explore/Filter.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Progressbar from '@/component/Progressbar';
import RegionSelectorRaw from '@/component/selector/RegionSelector';
import TravelActivitySelectorRaw from '@/component/selector/TravelActivitySelector';
import { ArrowLeft } from '@/assets';
import { Button } from '@/component';

type Pair = { left?: string; right?: string };
type Phase = 'select' | 'loading' | 'results';

function toPair(v: any): Pair {
  if (!v) return {};
  if (typeof v === 'string') return { left: v };
  if (Array.isArray(v)) return { left: v[0], right: v[1] };
  if ('left' in v || 'right' in v) return { left: v.left, right: v.right };
  const left =
    v?.sido ?? v?.group ?? v?.category ?? v?.parent ?? v?.main ?? v?.value ?? v?.key ?? v?.[0];
  const right = v?.sigungu ?? v?.theme ?? v?.sub ?? v?.child ?? v?.detail ?? v?.label ?? v?.[1];
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
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-green3-light relative sticky top-0 z-50 h-10 w-full shadow-sm">
        <button onClick={() => navigate(-1)} className="absolute top-1/2 -translate-y-1/2 pl-4">
          <ArrowLeft className="w-4" />
        </button>
        <span className="text-caption3 text-green1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          여행지 탐색
        </span>
      </div>
      <div className="px-8">
        {/* 진행 바 */}
        <div className="pt-5 pb-2">
          <Progressbar progress={progress} />
        </div>

        {/* 본문 */}
        <div className="flex-1 py-3">
          {phase === 'select' && (
            <>
              {step === 1 ? (
                <>
                  <h2 className="text-green1 mb-4 text-base font-semibold">
                    1단계: 지역을 골라주세요.
                  </h2>
                  <div className="rounded-2xl bg-white">
                    <RegionSelector onSelect={setRegion} />
                  </div>
                  <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
                    <Button variant="lg" color="green3" className="w-full" onClick={next}>
                      다음
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-green1 mb-4 text-base font-semibold">
                    2단계: 테마를 골라주세요.
                  </h2>
                  <div className="rounded-2xl bg-white">
                    <TravelActivitySelector onSelect={setActivity} />
                  </div>
                  <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
                    <div className="flex justify-between">
                      <Button color="green-muted" variant="md" onClick={prev}>
                        이전
                      </Button>
                      <Button color="green3" variant="md" onClick={handleFinish}>
                        완료
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {phase === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-green1 animate-pulse font-semibold">여행지를 불러오는 중…</div>
            </div>
          )}

          {phase === 'results' && (
            <>
              <h2 className="text-green1 mb-3 text-base font-semibold">탐색 결과</h2>

              <div className="mb-4 flex flex-wrap gap-2">
                {region.left && (
                  <span className="bg-green3-light text-green1 border-green3 rounded-full border px-3 py-1 text-sm">
                    지역: {region.left}
                    {region.right ? ` ${region.right}` : ''}
                  </span>
                )}
                {activity.left && activity.right && (
                  <span className="bg-pink text-green1 border-red2 rounded-full border px-3 py-1 text-sm">
                    테마: {activity.left} / {activity.right}
                  </span>
                )}
                <button
                  onClick={resetAndSelectAgain}
                  className="bg-gray2 ml-auto rounded-full px-3 py-1 text-sm hover:opacity-80"
                >
                  다시 선택하기
                </button>
              </div>

              {error && (
                <div className="border-red2 bg-red2 mb-4 rounded-lg border px-3 py-2 text-sm text-white">
                  {error}
                </div>
              )}
              {!error && results.length === 0 && (
                <div className="text-gray1 py-16 text-center">
                  조건에 맞는 여행지가 없어요. 필터를 바꿔보세요.
                </div>
              )}

              <ul className="grid grid-cols-1 gap-4">
                {results.map((p) => (
                  <li
                    key={String(p.id ?? p.name)}
                    className="border-gray1 overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <div className="bg-gray2 h-40 w-full">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-gray1 flex h-full w-full items-center justify-center">
                          이미지 없음
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-green1 font-semibold">{p.name}</div>
                      <div className="text-green-muted mt-1 text-sm">
                        {(p.sido || p.sigungu) && `${p.sido ?? ''} ${p.sigungu ?? ''}`}
                      </div>
                      {p.tags && p.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="bg-blue btn-text-white rounded-full px-2 py-0.5 text-xs"
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
    </div>
  );
}
