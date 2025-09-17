import { Header, PlaceCard, Sidebar } from '@/component';
import { useMemo, useState } from 'react';
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
  const places = state?.places ?? [];

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  // ✅ 서버 응답 → UI 안전값으로 정규화
  const normalized = useMemo(() => {
    return (places ?? []).map((p, idx) => {
      // dist는 문자열로 오므로 숫자로 파싱(옵션)
      const distNum = Number(p.dist);
      const distKm = Number.isFinite(distNum)
        ? distNum >= 1000
          ? `${(distNum / 1000).toFixed(1)}km`
          : `${Math.round(distNum)}m`
        : undefined;

      // quietnessLevel: -1 은 "데이터 없음" → 0으로 보정(PlaceCard가 숫자 가정 시 안전)
      const quiet =
        typeof p.quietnessLevel === 'number' && p.quietnessLevel >= 0
          ? Math.min(5, p.quietnessLevel)
          : 0;

      // likeCount: null → 0
      const likes = typeof p.likeCount === 'number' ? p.likeCount : 0;

      return {
        key: p.contentid ?? `${p.title ?? 'item'}-${idx}`,
        id: p.contentid ?? '',
        imgUrl: p.firstimage ?? '',
        title: p.title ?? '(제목 없음)',
        theme: p.catName ?? '', // null이면 공백
        quietLevel: quiet,
        likeCount: likes,
        distText: distKm, // 필요하면 PlaceCard에 추가 props로 표시
      };
    });
  }, [places]);

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
            <li className="py-8 text-center text-sm text-gray-500">표시할 결과가 없어요.</li>
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
                      quietLevel={it.quietLevel} // 0~5로 보정된 숫자
                      likeCount={it.likeCount} // null → 0 보정
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
