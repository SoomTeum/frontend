import { useEffect, useMemo, useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import PlaceCard from '@/component/common/Card/PlaceCard';
import { getSavedPlaces, unsavePlace, type SavedPlaceItem } from '@/api/Myplace/myPlace.api';
import { useNavigate } from 'react-router-dom';
import SortPillSelect, { type Option } from '@/component/selector/SortPillSelect';

const PAGE_SIZE = 20;

type Row = SavedPlaceItem;
const arrangeOptions: Option<'O' | 'Q' | 'R' | 'S'>[] = [
  { value: 'O', label: '기본순' },
  { value: 'Q', label: '수정일순' },
  { value: 'R', label: '등록일순' },
  { value: 'S', label: '거리순' },
];
const MyTravelList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [arrange, setArrange] = useState<'O' | 'Q' | 'R' | 'S'>('O');

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
      await unsavePlace({ contentId: String(item.contentId) });
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
      const hay = `${it.placeName ?? ''} ${it.themeName ?? ''} ${it.contentId}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [items, q]);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="mx-auto flex w-full max-w-[430px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          나의 여행지
        </div>

        <div className="relative my-5 px-9">
          <input
            type="text"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-gray2 w-full rounded-full px-9 py-2 pl-10 text-sm text-black placeholder:text-[#7f8c6b] focus:outline-none"
          />
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 px-9 text-[#7f8c6b]">
            <img src={SearchIcon} alt="search" className="h-4 w-4" />
          </span>
        </div>
        {/*정렬*/}
        <div className="-mt-2 mb-4 flex justify-end px-9">
          <SortPillSelect
            value={arrange}
            options={arrangeOptions}
            onChange={setArrange}
            size="sm"
          />
        </div>

        {error && (
          <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="flex flex-col gap-3 px-9">
          {filtered.map((row) => {
            const { contentId, themeName, likeCount, cnctrLevel } = row;

            const title = row.placeName || String(contentId);

            return (
              <PlaceCard
                key={String(row.contentId)}
                title={title}
                theme={themeName ?? '-'}
                likeCount={likeCount}
                imgUrl={undefined}
                quietLevel={cnctrLevel}
                showRemoveButton
                onClick={() => navigate(`/place/${contentId}`)}
                onRemove={() => handleRemoveItem(row)}
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
