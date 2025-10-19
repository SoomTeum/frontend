import api from '@/api/api';

export type SearchPlacesParams = {
  areaCode?: number | string;
  sigunguCode?: number | string;
  cat1?: string;
  cat2?: string;
  contentTypeId?: number;
  pageNo?: number;
  numOfRows?: number;
  arrange?: 'A' | 'C' | 'Q' | 'R';
  keyword?: string;
  _type?: string;
};

export type PlaceDto = {
  title: string;
  contentid: string;
  catName?: string;
  areaName?: string;
  firstimage?: string;
  dist?: string;
  likeCount?: number;
  cnctrRate?: string | number;
  quietnessLevel?: number;
};

function unwrap<T>(raw: any): T {
  return raw && typeof raw.success === 'boolean' && 'data' in raw ? raw.data : raw;
}
function toArray<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.items)) return raw.items;
  if (raw && typeof raw === 'object') return [raw as T];
  return [];
}

export async function searchPlaces(params: SearchPlacesParams): Promise<PlaceDto[]> {
  const cleanParams = { ...params };
  if (typeof cleanParams.keyword === 'string' && cleanParams.keyword.trim() === '') {
    delete (cleanParams as any).keyword;
  }
  const res = await api.get('/places', { params: cleanParams });
  return toArray<PlaceDto>(unwrap(res.data));
}

//-1(데이터 없음)은 undefined 처리
function toNumberOrUndef(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === 'number' ? v : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n === -1 ? undefined : n;
}

export function mapToCard(p: PlaceDto) {
  const raw = p.firstimage || '';
  const imgUrl =
    typeof raw === 'string' && raw.startsWith('http://')
      ? raw.replace(/^http:\/\//, 'https://')
      : raw || undefined;

  const quiet =
    typeof p.quietnessLevel === 'number' ? p.quietnessLevel : toNumberOrUndef(p.cnctrRate);

  return {
    id: p.contentid,
    title: p.title,
    theme: p.catName ?? '-',
    likeCount: p.likeCount ?? 0,
    imgUrl,
    quietLevel: quiet,
    cnctrRate: quiet,
  };
}
