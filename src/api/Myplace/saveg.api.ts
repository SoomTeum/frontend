import api from '../api';
import type { ApiResponse } from '@/types/api-response';

export type SavedPlace = {
  contentId: string | number;
  themeName?: string;
  regionName?: string;
  entrLevel?: number;
  likedCnt?: number;
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

export async function getSavedPlaces({
  page = 0,
  size = 20,
}: { page?: number; size?: number } = {}): Promise<SavedPlacesPage> {
  const { data } = await api.get<ApiResponse<SavedPlacesPage>>('/my/places', {
    params: { page, size },
  });
  return data.data;
}
