import api from "@/api/api";
import type { ApiResponse } from "@/types/api-response";

const ENDPOINT = "/places";
export type PlaceListItem = {
  title: string;
  contentId: string | number;
  cat1?: string;
  cat2?: string;
  dist?: number;
  cnctrRate?: string | number;
  [k: string]: any;
};
export type PlacesQuery = {
  areaCode?: number;      
  sigunguCode?: number;    
  cat1?: string;
  cat2?: string;
  contentTypeId?: number;
  pageNo?: number;         
  numOfRows?: number;      
  _type?: string;        
  arrange?: string;       
};
type MaybeWrapped<T> = ApiResponse<T> | T;

function prune<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
}
function unwrap<T>(payload: MaybeWrapped<T>): T {
  if (payload && typeof payload === "object" && "data" in (payload as any)) {
    return (payload as any).data as T;
  }
  return payload as T;
}
export async function fetchPlaces(params: PlacesQuery = {}): Promise<PlaceListItem[]> {
  const { data } = await api.get<MaybeWrapped<PlaceListItem[]>>(ENDPOINT, {
    params: prune(params),
  });
  return unwrap(data);
}
