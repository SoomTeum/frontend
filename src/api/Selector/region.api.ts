// src/api/region.api.ts
import api from "@/api/api";

/**
 * Swagger: GET /api/places/regions
 * "지역코드별로 그룹핑된 모든 지역 목록을 조회합니다."
 */

export interface SigunguDto {
  sigunguCode: string;
  sigunguName: string;
}

export interface AreaDto {
  areaCode: string;
  areaName: string;
  sigunguList: SigunguDto[];
}

type RegionsWire =
  | AreaDto[]
  | { data?: AreaDto[]; result?: AreaDto[] }
  | { success?: boolean; data?: AreaDto[] };

/** URL 파트 안전 합치기 (http[s]:// 보존, 중복 슬래시 제거) */
function joinUrl(...parts: (string | undefined | null)[]) {
  const raw = parts.filter(Boolean).join("/");
  return raw.replace(/(?<!:)\/{2,}/g, "/");
}

/** baseURL 안에 이미 "/api"가 포함되어 있으면 프리픽스는 비움 */
function resolveApiPrefix() {
  const base: string = (api as any)?.defaults?.baseURL ?? "";
  const envPrefix: string =
    (import.meta as any)?.env?.VITE_API_PREFIX?.toString?.() || "/api";

  try {
    // URL로 파싱해 path만 비교 (상대 baseURL일 수도 있으니 실패해도 무시)
    const url = new URL(base, "http://_dummy.origin");
    const path = url.pathname || "";
    if (path.split("/").includes("api")) return ""; // 이미 /api 세그먼트 존재
  } catch {
    // baseURL이 절대 URL이 아니라 상대 경로일 때
    if (typeof base === "string" && /(^|\/)api(\/|$)/.test(base)) return "";
  }
  return envPrefix;
}

// ---- 여기서 최종 엔드포인트 결정 ----
const API_PREFIX = resolveApiPrefix();
// 요청 URL을 "절대 경로(/...)"가 아니라 "상대 경로(places/...)"로 만들어
// baseURL이 '.../api'인 경우에도 중복 없이 붙도록 처리
const REGIONS_ENDPOINT = joinUrl(API_PREFIX || "", "places", "regions");

/**
 * 전체 지역(시/도 → 시군구) 목록 조회
 *
 * @param options.signal - 요청 취소용 AbortSignal
 * @returns AreaDto[]
 */
export async function fetchRegions(
  options?: { signal?: AbortSignal }
): Promise<AreaDto[]> {
  const res = await api.get<RegionsWire>(REGIONS_ENDPOINT, {
    signal: options?.signal,
  });

  const wire = res.data as any;

  // 다양한 래핑 케이스를 방어적으로 언랩
  const payload: unknown = Array.isArray(wire)
    ? wire
    : wire?.data ?? wire?.result ?? wire;

  if (!Array.isArray(payload)) {
    throw new Error("Invalid response format from /places/regions");
  }

  // (선택) 보기 좋은 정렬: areaName, sigunguName 기준
  const normalized: AreaDto[] = (payload as AreaDto[])
    .map((area) => ({
      ...area,
      sigunguList: Array.isArray(area.sigunguList)
        ? [...area.sigunguList].sort((a, b) =>
            a.sigunguName.localeCompare(b.sigunguName)
          )
        : [],
    }))
    .sort((a, b) => a.areaName.localeCompare(b.areaName));

  return normalized;
}

export default { fetchRegions };
