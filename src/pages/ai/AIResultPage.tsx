import { Header, PlaceCard, Sidebar } from '@/component';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AiPlace } from '@/api/List/aiList.api';

function getRankBadgeClass(n: number) {
  if (n === 1) return 'bg-red1 text-black';
  if (n === 2) return 'bg-orange text-black';
  if (n === 3) return 'bg-mint text-black';
  return 'bg-gray1 text-gray-700';
}

export default function AIResultPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { state } = useLocation() as { state?: { places?: AiPlace[] } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const places = state?.places ?? [];

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);
  const normalized = useMemo(() => {
    if (!Array.isArray(places)) {
      console.warn('places가 배열이 아닙니다:', places);
      return [];
    }

    return places.map((p, idx) => {
      const distNum = Number(p.dist);
      const distKm = Number.isFinite(distNum)
        ? distNum >= 1000
          ? `${(distNum / 1000).toFixed(1)}km`
          : `${Math.round(distNum)}m`
        : undefined;

      const quiet =
        typeof p.quietnessLevel === 'number'
          ? p.quietnessLevel >= 0
            ? Math.min(5, p.quietnessLevel)
            : -1 // -1이면 "정보없음" 처리용
          : -1;

      const likes = typeof p.likeCount === 'number' ? p.likeCount : 0;

      return {
        key: p.contentid ?? `${p.title ?? 'item'}-${idx}`,
        id: p.contentid ?? '',
        imgUrl: p.firstimage ?? '',
        title: p.title ?? '',
        theme: p.catName ?? '',
        quietLevel: quiet,
        likeCount: likes,
        distText: distKm,
      };
    });
  }, [places]);

  useEffect(() => {
    console.log('normalized:', normalized);
    console.log('normalized.length:', normalized.length);
  }, [normalized]);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />

      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          AI 맞춤 여행지 탐색
        </div>

        <ul className="w-full space-y-4 py-5 pr-8 pl-4">
          {normalized.length === 0 && (
            <li className="py-8 text-center">
              <div className="mb-2 text-sm text-gray-500">표시할 결과가 없어요.</div>
              <div className="text-xs text-gray-400">다른 조건으로 다시 검색해보세요.</div>
            </li>
          )}

          {normalized.map((it, idx) => {
            const rank = idx + 1;
            return (
              <li key={it.key}>
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold shadow-sm ${getRankBadgeClass(rank)}`}
                  >
                    {rank}
                  </span>
                  <div className="flex-1">
                    <PlaceCard
                      imgUrl={it.imgUrl}
                      title={it.title}
                      theme={it.theme}
                      quietLevel={it.quietLevel}
                      likeCount={it.likeCount}
                      onClick={() => it.id && navigate(`/place/${it.id}`)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
