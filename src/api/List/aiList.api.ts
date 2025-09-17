import api from '../api';
import type { ApiResponse } from '@/types/api-response';

export type Arrange = 'O' | 'Q' | 'R' | 'S';

export interface AiPlace {
  title: string;
  contentid: string;
  cat1: string;
  cat2: string;
  catName: string;
  areaCode: number;
  sigunguCode: number;
  areaName: string;
  firstimage: string;
  dist: string;
  likeCount: number;
  cnctrRate: string;
  quietnessLevel: number;
}

export interface AiPlacesParams {
  mapX: number; //경도(lng)
  mapY: number; //위도(lat)
  radius: number; //반경
  cat1?: string; //테마 대분류
  cat2?: string; //테마 소분류
  pageNo?: number;
  numOfRows?: number;
  arrange?: Arrange;
  _type?: string;
}
export async function getAIPlaces(params: AiPlacesParams): Promise<AiPlace[]> {
  // 서버가 "배열"을 바로 주는 형태라면 제네릭도 배열로!
  const { data } = await api.get<AiPlace[]>('/places/ai', { params });
  // 혹시 단일 객체로 올 때도 대비 (안전장치)
  return Array.isArray(data) ? data : data ? [data] : [];
}
