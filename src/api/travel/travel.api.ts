import api from "@/api/api";
import type { ApiResponse } from "@/types/api-response";
import { getThemeCodes, getRegionCodes } from "@/utils/ktoMapping";
import type { AiTravelBody, GeneralTravelBody } from "@/types/kto";

export function buildAiTravelBody(params: { main: string; sub: string }): AiTravelBody {
  const { cat1, cat2, cat3 } = getThemeCodes(params.main, params.sub);
  return { cat1, cat2, cat3 };
}

export function buildGeneralTravelBody(params: {
  region: string;
  sigungu?: string;
  main?: string;
  sub?: string;
}): GeneralTravelBody {
  const { areaCode, sigunguCode } = getRegionCodes(params.region, params.sigungu);
  if (params.main && params.sub) {
    const { cat1, cat2, cat3 } = getThemeCodes(params.main, params.sub);
    return { areaCode, sigunguCode, cat1, cat2, cat3 };
  }
  return { areaCode, sigunguCode };
}

function normalizeAxiosError(e: any): Error {
  const status = e?.response?.status;
  const respMsg =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message;

  if (status) return new Error(`[${status}] ${respMsg ?? "Server error"}`);
  if (e?.request) return new Error("Network error or no response from server");
  return new Error(respMsg ?? String(e));
}

export async function requestAiPlaces<T>(
  endpoint: string,
  params: { main: string; sub: string }
): Promise<T> {
  const body = buildAiTravelBody(params);
  try {
    const { data } = await api.post<ApiResponse<T>>(endpoint, body);
    return data.data;
  } catch (e) {
    throw normalizeAxiosError(e);
  }
}


export async function requestGeneralPlaces<T>(
  endpoint: string,
  params: { region: string; sigungu?: string; main?: string; sub?: string }
): Promise<T> {
  const body = buildGeneralTravelBody(params);
  try {
    const { data } = await api.post<ApiResponse<T>>(endpoint, body);
    return data.data;
  } catch (e) {
    throw normalizeAxiosError(e);
  }
}

/** ========================
import type { Place } from "@/types/place";
async function example() {
  // AI 여행지
  const aiResult = await requestAiPlaces<Place[]>("/ai/places", {
    main: "자연",
    sub: "자연관광지",
  });
  // 일반 여행지
  const generalResult = await requestGeneralPlaces<Place[]>("/places/search", {
    region: "서울특별시", // 별칭 허용 (regionMap에서 normalize)
    sigungu: "종로구",
    main: "자연",
    sub: "자연관광지",
  });
}
*/
