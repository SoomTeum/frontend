import { useEffect, useMemo, useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import {
  getSavedPlaces,
  unsavePlace,
  type SavedPlaceItem,
  type SavedPlacePage,
  type SavePlaceRequest,
} from '@/api/Myplace/myPlace.api';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

type Row = SavedPlaceItem & { regionName?: string };

const MyTravelList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const navigate = useNavigate();

  const loadPage = async (p: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const raw = (await getSavedPlaces(p, PAGE_SIZE)) as any;
      const pageData = raw?.content ? raw : (raw?.data ?? {});
      const content = Array.isArray(pageData.content) ? pageData.content : [];

      setItems((prev) => (replace ? content : [...prev, ...content]));
      setPage(pageData.page ?? p);
      setLast(!!pageData.last);
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

  const handleRemoveItem = async (item: Row) => {
    const snapshot = items;
    setItems((prev) => prev.filter((it) => it.contentId !== item.contentId));
    try {
      const payload: SavePlaceRequest = {
        contentId: String(item.contentId),
        regionName: item.regionName ?? '정보없음',
        themeName: item.themeName ?? '여행지',
        cnctrLevel: typeof item.cnctrLevel === 'number' ? item.cnctrLevel : 0,
      };
      await unsavePlace(payload);
    } catch (e) {
      console.error('[MyTravelList][unsavePlace]', e);
      // 롤백
      setItems(snapshot);
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
          {filtered.map((it) => {
            const title =
              it.regionName && it.themeName
                ? `${it.regionName} · ${it.themeName}`
                : it.regionName || it.themeName || String(it.contentId);

            const likeCount = it.likeCount;
            const quietLevel = it.cnctrLevel;

            return (
              <PlaceCard
                key={String(it.contentId)}
                title={title}
                theme={it.themeName ?? '-'}
                likeCount={likeCount}
                imgUrl={undefined}
                quietLevel={quietLevel}
                showRemoveButton
                onClick={() => navigate(`/place/${it.contentId}`)}
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
