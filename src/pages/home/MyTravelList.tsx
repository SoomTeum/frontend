// src/pages/MyTravelList.tsx
import { useEffect, useMemo, useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import {
  getSavedPlaces,
  type SavedPlace,
  forgetSavedPlaceSnapshot,
} from '@/api/Myplace/saveg.api';
import { unsavePlace, type PlaceActionRequestDto } from '@/api/Myplace/saved.api';

const PAGE_SIZE = 20;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function toCnctrLevel(it: SavedPlace): number {
  if (typeof (it as any).cnctrLevel === 'number') return (it as any).cnctrLevel;
  if (typeof it.entrLevel === 'number') return it.entrLevel;
  return 3;
}

const MyTravelList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<SavedPlace[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const loadPage = async (p: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getSavedPlaces({ page: p, size: PAGE_SIZE });
      setItems((prev) => (replace ? res.content : [...prev, ...res.content]));
      setPage(res.page);
      setLast(res.last);
    } catch (e) {
      console.error('[MyTravelList][getSavedPlaces]', e);
      setError('목록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(0, true);
  }, []);

  const handleRemoveItem = async (it: SavedPlace) => {
    const snapshot = items;
   
    setItems((prev) => prev.filter((p) => p.contentId !== it.contentId));
    try {
      const dto: PlaceActionRequestDto = {
        contentId: String(it.contentId),
        regionName: it.regionName || '기타',
        themeName: it.themeName || '기타',
        cnctrLevel: toCnctrLevel(it),
        action: 'UNSAVE',
        enabled: false,
      };
      await unsavePlace(dto);             
      forgetSavedPlaceSnapshot(it.contentId); 
      await loadPage(0, true);               
    } catch (e) {
      console.error('[MyTravelList][unsavePlace]', e);
      setItems(snapshot); 
      alert('삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const visible = useMemo(() => {
    const base = items.filter((it: any) => {
      if (typeof it.enabled === 'boolean') return it.enabled;
      if (typeof it.like === 'boolean') return it.like;
      return true;
    });
    if (!q.trim()) return base;
    const kw = q.trim().toLowerCase();
    return base.filter((it) => {
      const displayTitle =
        (it as any).title ||
        (it as any).name ||
        (it as any).placeTitle ||
        (it.regionName && it.themeName ? `${it.regionName} · ${it.themeName}` : undefined) ||
        it.regionName ||
        it.themeName ||
        String(it.contentId);
      return displayTitle.toLowerCase().includes(kw);
    });
  }, [items, q]);

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="px-4 pt-14 pb-8">
        <div className="mx-[-1rem] mb-3 rounded-b-xl bg-[#dfead1] pt-2 pb-3">
          <div className="text-heading3 text-green1 text-center font-bold">나의 여행지</div>
        </div>

        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-full bg-[#edf0e2] px-4 py-2 pl-10 text-sm text-black placeholder:text-[#7f8c6b] focus:outline-none"
          />
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#7f8c6b]">
            <img src={SearchIcon} alt="search" className="h-4 w-4" />
          </span>
        </div>

        {error && (
          <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          {visible.map((it) => {
            const displayTitle =
              (it as any).title ||
              (it as any).name ||
              (it as any).placeTitle ||
              (it.regionName && it.themeName ? `${it.regionName} · ${it.themeName}` : undefined) ||
              it.regionName ||
              it.themeName ||
              String(it.contentId);

            const imgUrl = (it as any).imageUrl ?? (it as any).firstImage ?? undefined;
            const likeCount = (it as any).likedCnt ?? (it as any).likeCount ?? 0;
            const quietLevel = clamp(
              Math.round((it as any).entrLevel ?? (it as any).cnctrLevel ?? 3),
              1,
              5
            );

            return (
              <PlaceCard
                key={String(it.contentId)}
                title={displayTitle}
                theme={it.themeName ?? '-'}
                likeCount={likeCount}
                imgUrl={imgUrl}         
                quietLevel={quietLevel}
                showRemoveButton
                onRemove={() => handleRemoveItem(it)}
              />
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          {!last && (
            <button
              onClick={() => loadPage(page + 1)}
              disabled={loading}
              className="rounded-full bg-[var(--color-green4)] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? '불러오는 중...' : '더 보기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTravelList;
