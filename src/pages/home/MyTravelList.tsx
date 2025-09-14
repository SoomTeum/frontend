// src/pages/MyTravelList.tsx
import { useEffect, useMemo, useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import { getSavedPlaces, type SavedPlace } from '@/api/Myplace/saveg';
import { unsavePlace } from '@/api/Myplace/saved';

const PAGE_SIZE = 20;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveItem = async (contentId: string | number) => {
    const snapshot = items;
    setItems((prev) => prev.filter((it) => it.contentId !== contentId));
    try {
      await unsavePlace(contentId);
    } catch (e) {
      console.error('[MyTravelList][unsavePlace]', e);
      setItems(snapshot); // 롤백
      alert('삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const kw = q.trim().toLowerCase();
    return items.filter((it) => {
      const title = `${it.regionName ?? ''} ${it.themeName ?? ''} ${it.contentId}`.toLowerCase();
      return title.includes(kw);
    });
  }, [items, q]);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />
      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          나의 여행지
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
          {filtered.map((it) => {
            const title =
              it.regionName && it.themeName
                ? `${it.regionName} · ${it.themeName}`
                : it.regionName || it.themeName || String(it.contentId);

            const likeCount = (it as any).likeCnt ?? (it as any).likedCnt ?? 0;
            const quietLevel = clamp(Math.round(it.entrLevel ?? 3), 1, 5);

            return (
              <PlaceCard
                key={String(it.contentId)}
                title={title}
                theme={it.themeName ?? '-'}
                likeCount={likeCount}
                imgUrl={undefined}
                quietLevel={quietLevel}
                showRemoveButton
                onRemove={() => handleRemoveItem(it.contentId)}
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
