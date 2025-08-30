import api from '../api';

export interface KorDetailItem {
  title?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  addr1?: string;
  overview?: string;
}

export interface KorDetailResponse {
  header: { resultCode: string; resultMsg: string };
  body: {
    items?: { item?: KorDetailItem[] };
    totalCount: number;
    pageNo: number;
    numOfRows: number;
  };
}

export async function getKorDetail(contentId: string, pageNo = 1, numOfRows = 1) {
  const { data } = await api.get<KorDetailResponse>('/kor/detail', {
    params: { contentId, pageNo, numOfRows },
  });
  return data?.body?.items?.item?.[0] ?? null;
}
