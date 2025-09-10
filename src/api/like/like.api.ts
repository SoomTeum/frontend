import api from '../api';
import type { ApiResponse } from '@/types/api-response';

interface LikePlaceRequest {
  contentId: string;
  regionName: string;
  themeName: string;
  cnctrLevel: number;
}

interface LikePlaceResponse {
  placeId: number;
  type: 'LIKE';
  enabled: boolean;
  changed: boolean;
  likeCount: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const likePlace = (body: LikePlaceRequest) =>
  api.post<ApiResponse<LikePlaceResponse>>('/places/like', body);

export const unlikePlace = (contentId: string) =>
  api.delete<ApiResponse<LikePlaceResponse>>('/places/like', {
    params: { contentId },
  });
