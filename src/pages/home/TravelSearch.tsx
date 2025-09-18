import { useEffect, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import PlaceCard from "@/component/common/Card/PlaceCard";
import { fetchPlaces, type PlaceListItem } from "@/api/travel/place.api";
import { displayThemeLabel } from "@/constants/themeMap";

type TravelItem = {
  id: string;             
  title: string;
  tranquil: boolean;
  type: string;           
  likes: number;
  imgUrl?: string;
  _raw?: PlaceListItem;
};
const DETAIL_ROUTE = (contentId: string) => `/place/${encodeURIComponent(contentId)}`;
function pickContentId(raw: any): string | null {
  const cid =
    raw?.contentId ??
    raw?.contentid ??
    raw?.CONTENT_ID ??
    raw?.id ??
    null;
  if (cid === null || cid === undefined) return null;
  const s = String(cid).trim();
  return s.length > 0 && s !== "0" ? s : null; // '0' 같은 잘못된 값 방지
}
const rateToQuietLevel = (rate: unknown) => {
  const n = Number(rate);
  if (!Number.isFinite(n)) return 3;
  const table: Record<number, number> = { 0: 5, 1: 4, 2: 3, 3: 2 };
  return table[n] ?? 3;
};
const mapPlaceToTravelItem = (p: PlaceListItem): TravelItem | null => {
  const raw: any = p as any;
  const cid = pickContentId(raw);
  if (!cid) {
    console.warn("[TravelSearch] contentId 없음 → 제외됨. raw:", raw);
    return null;
  }
  const quiet = rateToQuietLevel(raw.cnctrRate);
  const title = raw.title ?? "이름 미상";
  const img =
    raw.firstimage ??
    raw.firstImage ??
    raw.imageUrl ??
    raw.imgUrl ??
    undefined;
  return {
    id: cid,                             
    title,
    tranquil: quiet >= 4,
    type: displayThemeLabel(raw),
    likes: Number(raw.likeCount ?? 0),
    imgUrl: img,
    _raw: p,
  };
};
const TravelSearch = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPlaces({
        pageNo: 1,
        numOfRows: 20,
        _type: "json",
        arrange: "O",
      });

      const mapped = list
        .map(mapPlaceToTravelItem)
        .filter((x): x is TravelItem => x !== null);
      if (mapped.length !== list.length) {
        console.warn(
          `[TravelSearch] 총 ${list.length}개 중 ${list.length - mapped.length}개는 contentId 누락으로 제외`
        );
      }
      setTravelItems(mapped);
    } catch (e: any) {
      console.error("[TravelSearch][fetchPlaces][error]", e);
      setError(e?.message || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openDetail = (item: TravelItem) => {
    navigate(DETAIL_ROUTE(item.id));
  };

  const handleCardKey = (e: KeyboardEvent<HTMLDivElement>, item: TravelItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail(item);
    }
  };

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="pt-14 px-4 pb-8">
        <div className="mx-[-1rem] mb-3 rounded-b-xl bg-green3-light pb-3 pt-2">
          <div className="text-center text-heading3 font-bold text-green1">여행지 탐색</div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div className="flex flex-col gap-3">
          {travelItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`여행지 상세로 이동: ${item.title}`}
              data-content-id={item.id}
              onClick={() => openDetail(item)}
              onKeyDown={(e) => handleCardKey(e, item)}
              className="relative rounded-lg transition shadow-sm outline-none focus:ring-2 focus:ring-green3 cursor-pointer hover:shadow-md"
            >
              <PlaceCard
                title={item.title}
                theme={item.type}              
                likeCount={item.likes}
                imgUrl={item.imgUrl}
                quietLevel={item.tranquil ? 5 : 3}
                showRemoveButton={false}
              />
            </div>
          ))}

          {!loading && !error && travelItems.length === 0 && (
            <div className="rounded-lg border border-green3 p-4 text-center text-green1">
              표시할 여행지가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelSearch;
