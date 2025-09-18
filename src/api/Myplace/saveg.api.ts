import api from "../api";
import type { ApiResponse } from "@/types/api-response";

export type SavedPlaceSnapshot = {
  contentId: string | number;
  title?: string;
  imageUrl?: string;
  areaName?: string;
  sigunguName?: string;
  regionName?: string;
};

const SNAP_KEY = "st_saved_place_snapshot";

function loadSnapshots(): Record<string, SavedPlaceSnapshot> {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveSnapshots(map: Record<string, SavedPlaceSnapshot>) {
  try {
    localStorage.setItem(SNAP_KEY, JSON.stringify(map));
  } catch {
 
  }
}

export function rememberSavedPlaceSnapshot(s: SavedPlaceSnapshot) {
  const map = loadSnapshots();
  const key = String(s.contentId);
  map[key] = { ...(map[key] || {}), ...s, contentId: key };
  saveSnapshots(map);
}

export function forgetSavedPlaceSnapshot(contentId: string | number) {
  const map = loadSnapshots();
  delete map[String(contentId)];
  saveSnapshots(map);
}

export type SavedPlaceRaw = {
  cnctrLevel?: number;    
  entrLevel?: number;     
  contentId: string | number;
  likeCount?: number;
  likedCnt?: number;
  themeName?: string;
  regionName?: string;    // 있으면 사용
  areaName?: string;      // 서버가 주면 사용
  sigunguName?: string;   // 서버가 주면 사용
  imageUrl?: string;      // 서버가 주면 사용
  firstImage?: string;    // 서버가 주면 사용
  title?: string;         // 서버가 주면 사용
  name?: string;          // 서버가 주면 사용
  placeTitle?: string;    // 서버가 주면 사용
  savedAt: string | number[]; 
};

export type SavedPlacesPageRaw = {
  content: SavedPlaceRaw[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type SavedPlace = {
  contentId: string | number;
  title?: string;
  imageUrl?: string;
  areaName?: string;
  sigunguName?: string;
  themeName?: string;
  regionName?: string;
  entrLevel?: number;
  likedCnt?: number;
  likeCount?: number;
  cnctrLevel?: number;
  savedAt: string; 
};

export type SavedPlacesPage = {
  content: SavedPlace[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

function toIsoFromArray(a: any): string {
  if (!Array.isArray(a) || a.length < 3) return new Date().toISOString();
  const [y, m, d, hh = 0, mm = 0, ss = 0, ns = 0] = a;
  const ms = Math.floor((Number(ns) || 0) / 1e6);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss, ms).toISOString();
}

function unwrap<T>(raw: T | ApiResponse<T>): T {
  const any = raw as any;
  return any && typeof any === "object" && "data" in any ? (any.data as T) : (raw as T);
}

function normalizeOne(raw: SavedPlaceRaw, snap?: SavedPlaceSnapshot): SavedPlace {
  const title =
    raw.title ??
    raw.name ??
    raw.placeTitle ??
    snap?.title;

  const imageUrl =
    raw.imageUrl ??
    raw.firstImage ??
    snap?.imageUrl;

  const areaName = raw.areaName ?? snap?.areaName;
  const sigunguName = raw.sigunguName ?? snap?.sigunguName;

  const entrLevel =
    typeof raw.entrLevel === "number"
      ? raw.entrLevel
      : typeof raw.cnctrLevel === "number"
        ? raw.cnctrLevel
        : undefined;

  const likedCnt =
    typeof raw.likedCnt === "number"
      ? raw.likedCnt
      : typeof raw.likeCount === "number"
        ? raw.likeCount
        : undefined;

  const regionName =
    raw.regionName ??
    snap?.regionName ??
    (areaName || sigunguName ? [areaName, sigunguName].filter(Boolean).join(" ") : undefined);

  let savedAt: string;
  if (Array.isArray(raw.savedAt)) savedAt = toIsoFromArray(raw.savedAt);
  else if (typeof raw.savedAt === "string") savedAt = new Date(raw.savedAt).toISOString();
  else savedAt = new Date().toISOString();

  return {
    contentId: raw.contentId,
    title,
    imageUrl,
    areaName,
    sigunguName,
    themeName: raw.themeName,
    regionName,
    entrLevel,
    likedCnt,
    likeCount: raw.likeCount,
    cnctrLevel: raw.cnctrLevel,
    savedAt,
  };
}

function normalizePage(raw: SavedPlacesPageRaw): SavedPlacesPage {
  const snaps = loadSnapshots();
  const content = (raw.content || []).map((r) =>
    normalizeOne(r, snaps[String(r.contentId)])
  );
  return {
    content,
    page: Number(raw.page ?? 0),
    size: Number(raw.size ?? content.length),
    totalElements: Number(raw.totalElements ?? content.length),
    totalPages: Number(raw.totalPages ?? 1),
    first: Boolean(raw.first ?? true),
    last: Boolean(raw.last ?? true),
    hasNext: raw.hasNext,
    hasPrevious: raw.hasPrevious,
  };
}
export async function getSavedPlaces(
  { page = 0, size = 20 }: { page?: number; size?: number } = {}
): Promise<SavedPlacesPage> {
  const { data } = await api.get<ApiResponse<SavedPlacesPageRaw> | SavedPlacesPageRaw>(
    "/my/places",
    { params: { page, size } }
  );
  const payload = unwrap<SavedPlacesPageRaw>(data);
  return normalizePage(payload);
}

export default {
  getSavedPlaces,
  rememberSavedPlaceSnapshot,
  forgetSavedPlaceSnapshot,
};
