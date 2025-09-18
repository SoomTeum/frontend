// src/pages/TravelSearch.tsx
import { useEffect, useMemo, useState } from "react";
import Header from "@/component/Header";
import Sidebar from "@/component/SideBar";
import PlaceCard from "@/component/common/Card/PlaceCard";
import { saveMyPlace as savePlace } from "@/api/Myplace/savep.api";
import { fetchPlaces, type PlaceListItem, type PlacesQuery } from "@/api/travel/place.api";
import { useAIExploreStore } from "@/stores/useAIExploreStore";

type TravelItem = {
  id: number | string;
  title: string;
  tranquil: boolean;   // 조용함 여부
  type: string;        // "cat1/cat2" 등 테마명
  likes: number;
  imgUrl?: string;
  region?: string;
  regionBadge?: string;
};

const PLACEHOLDER_IMG = "/image/placeholder.png";

// URL을 https로 보정
function toHttps(u?: string): string | undefined {
  if (!u) return undefined;
  const s = String(u).trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return "https:" + s;
  if (s.startsWith("http://")) return "https://" + s.slice("http://".length);
  return s;
}

// 안전하게 깊은 경로 접근
function getNested(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

// 다양한 형태(url/src/img…)에서 이미지 URL 뽑기
function normalizeUrlValue(v: any): string | undefined {
  if (!v) return undefined;
  if (Array.isArray(v)) {
    for (const it of v) {
      const u = normalizeUrlValue(it);
      if (u) return u;
    }
    return undefined;
  }
  if (typeof v === "object") {
    const keys = ["url", "src", "img", "path", "imgpath", "originimgurl", "smallimageurl"];
    for (const k of keys) {
      if (v[k]) return String(v[k]);
    }
    return undefined;
  }
  if (typeof v === "string") return v;
  return undefined;
}

// 백 응답에서 이미지 후보값들 추려서 https URL로 확정
function resolveImageUrl(p: any): string | undefined {
  const rawCandidates = [
    p.imgUrl,
    p.imageUrl,
    p.thumbnail,
    p.thumbUrl,
    p.mainImage,
    p.pictureUrl,
    p.firstImage,
    p.firstimage,
    p.firstImage2,
    p.firstimage2,
    p.smallimageurl,
    p.originimgurl,
    getNested(p, "repPhoto.photoid.imgpath"),
    getNested(p, "repPhoto.photoid_thumbnail.imgpath"),
    getNested(p, "images.0.url"),
    getNested(p, "photos.0.url"),
  ].filter((x) => x != null);

  for (const cand of rawCandidates) {
    const raw = normalizeUrlValue(cand);
    const httpsed = toHttps(raw);
    if (httpsed) return httpsed;
  }
  return undefined;
}

// 플레이스홀더 부착
function withPlaceholder(u?: string): string {
  return u && typeof u === "string" && u.trim() ? u : PLACEHOLDER_IMG;
}

const TravelSearch = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | number | null>(null);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // 🔥 핵심: ThemeSelect에서 저장한 테마 코드(cat1/cat2[]) 읽기
  const themeCodes = useAIExploreStore((s) => s.themeCodes); // { cat1: string|null, cat2: string[] }
  const theme = useAIExploreStore((s) => s.theme);           // { main, subs } (배지 표기용)

  const cat1 = themeCodes?.cat1 ?? undefined;
  const cat2 = themeCodes?.cat2 && themeCodes.cat2.length ? themeCodes.cat2 : undefined;

  // 상단 배지(선택된 테마 표시)
  const themeBadge = useMemo(() => {
    if (!theme?.main) return undefined;
    const subs = (theme?.subs ?? []).join(", ");
    return subs ? `${theme.main} · ${subs}` : theme.main;
  }, [theme]);

  // 백엔드 PlaceListItem -> 화면용 TravelItem 매핑
  function mapToTravelItem(p: PlaceListItem): TravelItem {
    const id = (p as any).contentId ?? Math.random().toString(36).slice(2);
    const type = [(p as any).cat1, (p as any).cat2].filter(Boolean).join("/") || "기타";

    // 혼잡도 → 조용함 추정
    let tranquil = false;
    const rate = (p as any).cnctrRate;
    if (rate !== undefined && rate !== null) {
      const n = Number(rate);
      if (!Number.isNaN(n)) tranquil = n >= 4;
      else tranquil = String(rate).toLowerCase().includes("low");
    }

    const resolved = resolveImageUrl(p);
    const imgUrl = withPlaceholder(resolved);

    const areaName = (p as any).areaName;
    const sigunguName = (p as any).sigunguName;
    const region =
      (p as any).regionName ||
      (areaName && sigunguName ? `${areaName} ${sigunguName}` : areaName) ||
      undefined;

    const likeCount =
      (p as any).likeCount != null ? Number((p as any).likeCount) : 0;

    return {
      id,
      title: (p as any).title ?? "(제목 없음)",
      tranquil,
      type,
      likes: Number.isFinite(likeCount) ? likeCount : 0,
      imgUrl,
      region,
      regionBadge: region,
    };
  }

  async function load(query: PlacesQuery = {}) {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await fetchPlaces(query);
      setItems(list.map(mapToTravelItem));
    } catch (e: any) {
      console.error("[TravelSearch][fetchPlaces][error]", {
        message: e?.message,
        code: e?.code,
        raw: e?.raw,
      });
      setLoadError(e?.message ?? "여행지 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 최초 로드 + 테마 코드 변경 시 재조회
  useEffect(() => {
    const q: PlacesQuery = {
      page: 0,
      size: 20,
      cat1,
      cat2, // 배열이면 /places?cat2=a&cat2=b… 로 직렬화되도록 api에서 처리
    };
    void load(q);
    // cat2 배열 비교를 위해 문자열화
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat1, JSON.stringify(cat2)]);

  const handleSaveItem = async (item: TravelItem) => {
    if (savingId === item.id) return;
    try {
      setSavingId(item.id);

      const themeName = item.type || "기타";
      const regionName = item.region || item.regionBadge || "미지정";

      const payload = {
        contentId: item.id,
        cnctrLevel: item.tranquil ? 5 : 3,
        themeName,
        regionName,
      };

      const res = await savePlace(payload);
      console.log("[TravelSearch][savePlace][ok]", res);
      alert(`저장 완료! (placeId=${res.placeId}, changed=${res.changed})`);
    } catch (e: any) {
      console.error("[TravelSearch][savePlace][error]", e);
      alert(e?.message ?? "저장 중 오류가 발생했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="pt-14 px-4 pb-8">
        <div className="mx-[-1rem] mb-3 rounded-b-xl bg-green3-light pb-3 pt-2">
          <div className="text-center text-heading3 font-bold text-green1">여행지 탐색</div>
          {themeBadge && (
            <div className="mt-2 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-green3-light)] px-3 py-1 text-[12px] text-[var(--color-green1)]">
                <span className="opacity-70">필터</span>
                <span className="opacity-40">|</span>
                <span>{themeBadge}</span>
              </span>
            </div>
          )}
        </div>

        {loading && <div className="text-center text-green1 py-6">불러오는 중…</div>}
        {loadError && (
          <div className="text-center text-red-600 py-4">
            {loadError}
            <button
              className="ml-3 underline"
              onClick={() =>
                load({
                  page: 0,
                  size: 20,
                  cat1,
                  cat2,
                })
              }
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const isSaving = savingId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSaveItem(item)}
                  disabled={isSaving}
                  aria-busy={isSaving}
                  className={`text-left rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-green3)] ${
                    isSaving ? "opacity-60 cursor-wait" : "cursor-pointer"
                  }`}
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
                    <div className="mt-1 text-xs text-green-muted">저장 중…</div>
                  )}
                </button>
              );
            })}
            {items.length === 0 && (
              <div className="text-center text-green-muted py-6">
                표시할 여행지가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelSearch;
