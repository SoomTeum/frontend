
import api from "../api";
import type { ApiResponse } from "@/types/api-response";

export type PlaceSaveResult = {
  placedId: number;
  type: string;
  enabled: boolean;
  changed: boolean;
  likeCount: number;
  message: string;
  createdAt: string;
  updatedAt: string;
};
export type PlaceActionRequestDto = {
  contentId: string | number;
  regionName: string;  
  themeName: string;    
  cnctrLevel: number;   
  enabled?: boolean;            
  action?: "UNSAVE" | "SAVE";   
};

function unwrap<T>(raw: T | ApiResponse<T>): T {
  const any = raw as any;
  return any && typeof any === "object" && "data" in any && any.data != null
    ? (any.data as T)
    : (raw as T);
}

export async function unsavePlace(
  dto: PlaceActionRequestDto
): Promise<PlaceSaveResult> {
  const body: PlaceActionRequestDto = {
    ...dto,
    cnctrLevel: Number(dto.cnctrLevel),
    enabled: dto.enabled ?? false,
    action: dto.action ?? "UNSAVE",
  };

  const { data } = await api.delete<ApiResponse<PlaceSaveResult> | PlaceSaveResult>(
    "/my/places/save",
    {
      data: body,
      headers: { "Content-Type": "application/json" },
    }
  );

  return unwrap<PlaceSaveResult>(data);
}

export default { unsavePlace };
