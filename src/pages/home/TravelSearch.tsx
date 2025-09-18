import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import SearchingOverlay from '../explore/Searching';
import { searchPlaces, mapToCard, type PlaceDto } from '@/api/travel/places.api';

type NavState = {
  region?: { areaCode?: number | string; sigunguCode?: number | string };
  activity?: { cat1?: string; cat2?: string[] }; // cat2 다중이면 첫 값만 사용
};

const PAGE_SIZE = 20;

const TravelSearch = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const navState = (state || {}) as NavState;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [q, setQ] = useState('');
  const [items, setItems] = useState<ReturnType<typeof mapToCard>[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // 최초/필터 변경 시 리스트 초기화 후 1페이지 로드
  useEffect(() => {
    setItems([]);
    setPageNo(1);
    setHasMore(true);
    // 즉시 첫 페이지
    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navState?.region?.areaCode,
    navState?.region?.sigunguCode,
    navState?.activity?.cat1,
    JSON.stringify(navState?.activity?.cat2 || []),
  ]);

  async function loadPage(p: number, replace = false) {
    if (loading || (!hasMore && !replace)) return;
    setLoading(true);
    setErr(null);
    try {
      const params = {
        areaCode: navState.region?.areaCode,
        sigunguCode: navState.region?.sigunguCode,
        cat1: navState.activity?.cat1,
        cat2: navState.activity?.cat2?.[0], // 서버가 단일만 받을 때
        pageNo: p,
        numOfRows: PAGE_SIZE,
        arrange: 'O' as const,
      };
      const list: PlaceDto[] = await searchPlaces(params);
      const mapped = list.map(mapToCard);

      setItems((prev) => (replace ? mapped : [...prev, ...mapped]));
      setPageNo(p);
      setHasMore(list.length >= PAGE_SIZE);
    } catch (e) {
      setErr('여행지 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((it) => it.title.toLowerCase().includes(kw));
  }, [items, q]);

  return (
    <div className="bg-beige1 min-h-screen">
      <SearchingOverlay open={loading && items.length === 0 && pageNo === 1} />

      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="px-4 pt-14 pb-8">
        <div className="bg-green3-light mx-[-1rem] mb-3 rounded-b-xl pt-2 pb-3">
          <div className="text-heading3 text-green1 text-center font-bold">여행지 탐색</div>
        </div>

        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-green0 placeholder:text-green-muted w-full rounded-full px-4 py-2 pl-10 text-sm text-black focus:outline-none"
          />
          <span className="text-green-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            <img src={SearchIcon} alt="search" className="h-4 w-4" />
          </span>
        </div>

        {err && (
          <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{err}</div>
        )}

        {!loading && !err && filtered.length === 0 && (
          <div className="py-10 text-center text-gray-500">조건에 맞는 결과가 없어요.</div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((it) => (
            <PlaceCard
              key={String(it.id)}
              title={it.title}
              theme={it.theme}
              likeCount={it.likeCount}
              imgUrl={it.imgUrl}
              quietLevel={it.quietLevel}
              onClick={() => navigate(`/place/${it.id}`)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          {hasMore && (
            <button
              onClick={() => loadPage(pageNo + 1)}
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

export default TravelSearch;
