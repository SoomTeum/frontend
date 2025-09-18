// src/api/Myplace/savep.api.ts
import api from "@/api/api"; 

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
  message: string;   // ← 클라이언트에서 한글로 덮어씀
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
  if (anyRaw && typeof anyRaw === "object" && "data" in anyRaw && anyRaw.data) {
    return anyRaw.data as T;
  }
  return raw as T;
}

export async function savePlace(payload: SaveMyPlaceRequest): Promise<SaveMyPlaceResponse> {
  try {
    const body: SaveMyPlaceRequest = {
      ...payload,
      cnctrLevel: Number(payload.cnctrLevel),
    };

    const { data } = await api.put<SaveMyPlaceResponse | ApiEnvelope<SaveMyPlaceResponse>>(
      "/my/places/save",
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const unwrapped = unwrapResponse<SaveMyPlaceResponse>(data);

    // ✅ 표시/반환 메시지를 한글로 통일
    const msg = "저장되었습니다.";
    const final: SaveMyPlaceResponse = { ...unwrapped, message: msg };

    if (typeof window !== "undefined" && typeof window.alert === "function") {
      window.alert(msg);
    }

    return final;
  } catch (err: any) {
    console.error("[savePlace][raw error]", err?.response || err);
    const serverMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error?.message ||
      err?.message;
    throw new Error(serverMsg || "네트워크 오류 또는 서버 에러가 발생했습니다.");
  }
}

export default { savePlace };
