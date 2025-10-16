import api from "@/api/api";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api-response";

export interface ThemeCat2 {
  cat2: string;      
  cat2Name: string;  
}

export interface ThemeGroup {
  cat1: string;        
  cat1Name: string;    
  cat2List: ThemeCat2[];
}

type ThemeGroupsWire =
  | ThemeGroup[]
  | ApiResponse<ThemeGroup[]>
  | { result?: ThemeGroup[]; data?: ThemeGroup[] };
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
    if (path.split("/").includes("api")) return "";
  } catch {
    if (typeof base === "string" && /(^|\/)api(\/|$)/.test(base)) return "";
  }
  return envPrefix;
}

const API_PREFIX = resolveApiPrefix();
const THEMES_ENDPOINT = joinUrl(API_PREFIX || "", "places", "themes");



export async function getThemeGroups(
  options?: { signal?: AbortSignal }
): Promise<ThemeGroup[]> {
  const res: AxiosResponse<ThemeGroupsWire> = await api.get(THEMES_ENDPOINT, {
    signal: options?.signal,
  });

  const wire = res.data as any;

  const payload: unknown = Array.isArray(wire)
    ? wire
    : wire?.data ?? wire?.result ?? wire;

  if (!Array.isArray(payload)) {
    throw new Error("Invalid response format from /places/themes");
  }

  const normalized: ThemeGroup[] = (payload as ThemeGroup[])
    .map((group) => ({
      ...group,
      cat2List: Array.isArray(group.cat2List)
        ? [...group.cat2List].sort((a, b) =>
            a.cat2Name.localeCompare(b.cat2Name)
          )
        : [],
    }))
    .sort((a, b) => a.cat1Name.localeCompare(b.cat1Name));

  return normalized;
}

export default {
  getThemeGroups,
};
