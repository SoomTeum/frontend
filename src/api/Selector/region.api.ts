import api from "@/api/api";

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
function joinUrl(...parts: (string | undefined | null)[]) {
  const raw = parts.filter(Boolean).join("/");
  return raw.replace(/(?<!:)\/{2,}/g, "/");
}

function resolveApiPrefix() {
  const base: string = (api as any)?.defaults?.baseURL ?? "";
  const envPrefix: string =
    (import.meta as any)?.env?.VITE_API_PREFIX?.toString?.() || "/api";

  try {
     const url = new URL(base, "http://_dummy.origin");
    const path = url.pathname || "";
    if (path.split("/").includes("api")) return ""; // 이미 /api 세그먼트 존재
  } catch {
     if (typeof base === "string" && /(^|\/)api(\/|$)/.test(base)) return "";
  }
  return envPrefix;
}

const API_PREFIX = resolveApiPrefix();
const REGIONS_ENDPOINT = joinUrl(API_PREFIX || "", "places", "regions");


export async function fetchRegions(
  options?: { signal?: AbortSignal }
): Promise<AreaDto[]> {
  const res = await api.get<RegionsWire>(REGIONS_ENDPOINT, {
    signal: options?.signal,
  });

  const wire = res.data as any;

  const payload: unknown = Array.isArray(wire)
    ? wire
    : wire?.data ?? wire?.result ?? wire;

  if (!Array.isArray(payload)) {
    throw new Error("Invalid response format from /places/regions");
  }

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
