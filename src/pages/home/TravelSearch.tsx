import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import { searchPlaces, mapToCard, type PlaceDto } from '@/api/travel/places.api';
import SortPillSelect from '@/component/selector/SortPillSelect';

type NavState = {
  region?: { areaCode?: number | string; sigunguCode?: number | string };
  activity?: { cat1?: string; cat2?: string[] };
};
const PAGE_SIZE = 20;
const LEGACY_ARRANGE_OPTIONS = [
  { value: 'O', label: '기본순' },
  { value: 'Q', label: '수정일순' },
  { value: 'R', label: '등록일순' },
  { value: 'S', label: '한적함순' },
] as const;
type LegacyArrange = (typeof LEGACY_ARRANGE_OPTIONS)[number]['value'];

export default function TravelSearch() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const navState = (state || {}) as NavState;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [q, setQ] = useState('');
  const [items, setItems] = useState<ReturnType<typeof mapToCard>[]>([]);
  const [, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [arrange, setArrange] = useState<LegacyArrange>('O');
  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    (async () => {
      setItems([]);
      setPageNo(1);
      setHasMore(true);
      setErr(null);
      try {
        await loadPage(1, true);
      } catch (e) {
        console.error(e);
      }
    })();
   
  }, [
    navState?.region?.areaCode,
    navState?.region?.sigunguCode,
    navState?.activity?.cat1,
    JSON.stringify(navState?.activity?.cat2 || []),
    arrange,
    q,
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
        cat2: navState.activity?.cat2?.[0],
        pageNo: p,
        numOfRows: PAGE_SIZE,
        arrange,
        keyword: q.trim() || undefined,
      } as const;
      const list: PlaceDto[] = await searchPlaces(params);
      const mapped = list.map(mapToCard);
      setItems((prev) => (replace ? mapped : [...prev, ...mapped]));
      setPageNo(p);
      setHasMore(list.length >= PAGE_SIZE);
    } catch {
      setErr('여행지 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }
  const visible = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((it) => it.title.toLowerCase().includes(kw));
  }, [items, q]);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />
      <div className="mx-auto flex w-full max-w-[430px] flex-col">
        <div className="pt-14 pb-3">
          <div className="bg-green3-light text-caption3 text-green1 h-10 w-full py-[10px] text-center">
            여행지 탐색
          </div>
        </div>
        <div className="px-9">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-gray2 placeholder:text-green1 w-full rounded-full px-4 py-2 pl-16 text-sm text-black focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') loadPage(1, true);
              }}
            />
            <span className="text-green-muted pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 px-9">
              <img src={SearchIcon} alt="search" className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex justify-end">
            <SortPillSelect
              value={arrange}
              options={LEGACY_ARRANGE_OPTIONS as any}
              onChange={(v) => setArrange(v as LegacyArrange)}
              size="sm"
            />
          </div>
        </div>
        {loading && (
          <div className="py-10 text-center text-gray-500 animate-pulse">
            검색 중입니다...
          </div>
        )}
        {err && !loading && (
          <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{err}</div>
        )}
        {!err && !loading && visible.length === 0 && (
          <div className="py-10 text-center text-gray-500">조건에 맞는 결과가 없어요.</div>
        )}
        <div className="flex flex-col gap-3 px-9 pb-8 mt-2">
          {!loading &&
            visible.map((it) => (
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
      </div>
    </div>
  );
}
