// src/pages/TravelSearch.tsx
import { useEffect, useState, type KeyboardEvent } from "react";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import PlaceCard from "@/component/common/Card/PlaceCard";
import { fetchPlaces, type PlaceListItem } from "@/api/travel/place.api";
import { savePlace, type SaveMyPlaceRequest } from "@/api/Myplace/savep.api";
// ✅ 저장 후 목록에서 이름/이미지를 복원하기 위한 스냅샷 저장
import { rememberSavedPlaceSnapshot } from "@/api/Myplace/saveg.api";

type TravelItem = {
  id: number;
  title: string;
  tranquil: boolean;
  type: string;
  likes: number;
  imgUrl?: string;
  _raw?: PlaceListItem;
};

const TravelSearch = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const rateToQuietLevel = (rate: unknown) => {
    const n = Number(rate);
    if (!Number.isFinite(n)) return 3;
    const table: Record<number, number> = { 0: 5, 1: 4, 2: 3, 3: 2 };
    return table[n] ?? 3;
  };

  const toCnctrLevel = (rate: unknown) => {
    const n = Number(rate);
    return Number.isFinite(n) ? n : 3;
  };

  const parseAddr = (addr?: string): { areaName?: string; sigunguName?: string } => {
    if (!addr || typeof addr !== "string") return {};
    const parts = addr.trim().split(/\s+/);
    return { areaName: parts[0], sigunguName: parts[1] };
  };

  const getRegionName = (raw?: any) => {
    const { areaName, sigunguName } = {
      areaName: raw?.regionName || raw?.areaName,
      sigunguName: raw?.sigunguName,
      ...(!raw?.areaName && raw?.addr1 ? parseAddr(raw.addr1) : {}),
    };
    const name = [areaName, sigunguName].filter(Boolean).join(" ");
    return name || "기타";
  };

  const getThemeName = (raw?: any, fallback?: string) =>
    raw?.cat2 || raw?.cat1 || fallback || "기타";

  const mapPlaceToTravelItem = (p: PlaceListItem, idx: number): TravelItem => {
    const quiet = rateToQuietLevel((p as any).cnctrRate);
    return {
      id: Number((p as any).contentId ?? idx),
      title: (p as any).title ?? "이름 미상",
      tranquil: quiet >= 4,
      type: [(p as any).cat1, (p as any).cat2].filter(Boolean).join(" / ") || "기타",
      likes: Number((p as any).likeCount ?? 0),
      imgUrl: (p as any).firstimage || (p as any).firstImage || (p as any).imgUrl,
      _raw: p,
    };
  };

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
      setTravelItems(list.map(mapPlaceToTravelItem));
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

  const handleSave = async (item: TravelItem) => {
    if (savingId === item.id) return;

    const raw = item._raw as any;
    const payload: SaveMyPlaceRequest = {
      contentId: String(raw?.contentId ?? item.id),
      regionName: getRegionName(raw),
      themeName: getThemeName(raw, item.type),
      cnctrLevel: toCnctrLevel(raw?.cnctrRate),
    };

    try {
      setSavingId(item.id);
      const res = await savePlace(payload);
      console.log("[TravelSearch][savePlace][ok]", res);

      // ✅ 스냅샷 저장: 목록(API)에서 이름/이미지 안 내려와도 복원되도록
      const addrParsed = parseAddr(raw?.addr1);
      rememberSavedPlaceSnapshot({
        contentId: payload.contentId,
        title: raw?.title ?? item.title,
        imageUrl: raw?.firstImage ?? raw?.firstimage ?? raw?.imageUrl ?? item.imgUrl,
        areaName: raw?.areaName ?? addrParsed.areaName,
        sigunguName: raw?.sigunguName ?? addrParsed.sigunguName,
        regionName: getRegionName(raw),
      });

      alert(res.message || "저장 완료!");

      // 화면상의 좋아요 카운트 업데이트(선택)
      setTravelItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, likes: typeof res.likeCount === "number" ? res.likeCount : it.likes }
            : it
        )
      );
    } catch (err: any) {
      console.error("[TravelSearch][savePlace][error]", err);
      alert(err?.message || "저장 실패");
    } finally {
      setSavingId(null);
    }
  };

  const handleCardKey = (e: KeyboardEvent<HTMLDivElement>, item: TravelItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSave(item);
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
          {travelItems.map((item) => {
            const isSaving = savingId === item.id;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-disabled={isSaving}
                onClick={() => handleSave(item)}
                onKeyDown={(e) => handleCardKey(e, item)}
                className={`relative rounded-lg transition shadow-sm outline-none 
                            focus:ring-2 focus:ring-green3 
                            ${isSaving ? "opacity-60 pointer-events-none" : "cursor-pointer hover:shadow-md"}`}
              >
                <PlaceCard
                  title={item.title}
                  theme={item.type}
                  likeCount={item.likes}
                  imgUrl={item.imgUrl}
                  quietLevel={item.tranquil ? 5 : 3}
                  showRemoveButton={false}
                />

                {isSaving && (
                  <div className="absolute inset-0 rounded-lg bg-white/55 backdrop-blur-[1px] flex items-center justify-center text-green1 text-sm">
                    저장 중…
                  </div>
                )}
              </div>
            );
          })}

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
