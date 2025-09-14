import api from "../api";
import type { ApiResponse } from "@/types/api-response";

export type PlaceSaveResult = {
  placeId: number;
  typeId?: number;
  liked: boolean;     
  changed: boolean;    
  memo?: string | null;
  createdAt: string;   
  updatedAt: string;   
};

export async function unsavePlace(
  contentId: string | number
): Promise<PlaceSaveResult> {
  const { data } = await api.delete<ApiResponse<PlaceSaveResult>>(
    "/my/places/save",
    { params: { contentId: String(contentId) } } 
  );
  return data.data;
}
