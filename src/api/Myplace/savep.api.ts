import api from '@/api/api';

export type SaveMyPlaceRequest = {
  contentId: string;
  regionName: string;
  themeName: string;
  cnctrLevel: number;
};

export type SaveMyPlaceResponse = {
  placedId: number;
  type: string;
  like: boolean;
  enabled: boolean;
  changed: boolean;
  likeCount: number;
  message: string;
  createdAt: string;
  updatedAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  code?: string | number;
  error?: {
    code?: string | number;
    status?: number;
    message?: string;
    path?: string;
    timestamp?: string | number;
    detail?: string;
  };
};

function unwrapResponse<T>(raw: T | ApiEnvelope<T>): T {
  const anyRaw = raw as any;
  if (anyRaw && typeof anyRaw === 'object' && 'data' in anyRaw && anyRaw.data) {
    return anyRaw.data as T;
  }
  return raw as T;
}

function assertResponseShape(res: any): asserts res is SaveMyPlaceResponse {
  if (!res || typeof res.placedId !== 'number') {
    throw new Error('서버 응답 형식이 예상과 다릅니다.');
  }
}

export async function savePlace(payload: SaveMyPlaceRequest): Promise<SaveMyPlaceResponse> {
  try {
    const body: SaveMyPlaceRequest = {
      ...payload,
      cnctrLevel: Number(payload.cnctrLevel),
    };

    const { data } = await api.put<SaveMyPlaceResponse | ApiEnvelope<SaveMyPlaceResponse>>(
      '/my/places/save',
      body,
      { headers: { 'Content-Type': 'application/json' } },
    );

    const unwrapped = unwrapResponse<SaveMyPlaceResponse>(data);
    assertResponseShape(unwrapped);
    return unwrapped;
  } catch (err: any) {
    console.error('[savePlace][raw error]', err?.response || err);
    const serverMsg =
      err?.response?.data?.message || err?.response?.data?.error?.message || err?.message;
    throw new Error(serverMsg || '네트워크 오류 또는 서버 에러가 발생했습니다.');
  }
}

export default { savePlace };
