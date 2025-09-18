// src/api/travel/place.api.ts
import api from '@/api/api';

export type PlaceListItem = {
  contentId: string | number;
  title: string;
  imageUrl?: string;
  likeCount?: number;
  areaCode?: number | string;
  sigunguCode?: number | string;
  cat1?: string;
  cat2?: string;
  tranquil?: boolean;
  // ... 필요한 필드들
};

export type PlacesQuery = {
  page?: number;
  size?: number;

  // === 필터 ===
  cat1?: string | null;
  cat2?: string[] | null; // 다중 cat2 허용
  areaCode?: number | string;
  sigunguCode?: number | string;
  tranquil?: boolean;
  keywords?: string;
};

export async function fetchPlaces(query: PlacesQuery = {}) {
  // 서버가 cat2 키를 'cat2List'로 받는다면 아래 키만 바꾸면 됨.
  // const CAT2_KEY = 'cat2List';
  const CAT2_KEY = 'cat2';

  const params: Record<string, any> = { ...query };

  if (!query.cat1) delete params.cat1;
  if (!query.cat2 || !query.cat2.length) {
    delete params.cat2;
  } else {
    // axios 기본 직렬화는 배열에 [] 붙이거나 인덱싱할 수 있어 호환 이슈 발생
    // → URLSearchParams로 'cat2=...&cat2=...' 형태 강제
  }

  // 커스텀 직렬화: cat2 배열은 동일 키 반복으로 직렬화
  const res = await api.get<PlaceListItem[]>('/places', {
    params,
    paramsSerializer: (p) => {
      const usp = new URLSearchParams();
      Object.entries(p).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        if (k === 'cat2' && Array.isArray(v)) {
          v.forEach((vv) => usp.append(CAT2_KEY, String(vv)));
        } else if (Array.isArray(v)) {
          v.forEach((vv) => usp.append(k, String(vv)));
        } else {
          usp.append(k, String(v));
        }
      });
      return usp.toString();
    },
  });

  return res.data;
}
