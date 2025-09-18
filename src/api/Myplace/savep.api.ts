// src/api/Myplace/savep.api.ts
import api from "@/api/api";

export type SaveMyPlaceRequest = {
  contentId: string | number;

  // 코드 기반(권장)
  areaCode?: number | string;
  sigunguCode?: number | string;
  cat1?: string;
  cat2?: string;

  cnctrLevel?: number;

  // 레거시(문자명) — 백엔드가 아직 받을 수도 있어 optional로 유지
  regionName?: string;
  themeName?: string;
};

export type SaveMyPlaceData = {
  placeId: number;
  type: string;            // "CREATED" | "UPDATED" | "UNCHANGED" 등 백 정의에 맞춰 들어옴
  enabled: boolean;
  changed: boolean;
  likeCount?: number;
  message?: string;        // 백에서 사유 메시지 내려줄 수 있음
  createdAt?: string;
  updatedAt?: string;
};

type Wrapped<T> = {
  success: boolean;
  data: T | null;
  error?: {
    code?: number | string;
    status?: number;
    message?: string;
    path?: string;
    detail?: unknown;
  } | null;
};

class AppError extends Error {
  code: number | string;
  status?: number;
  raw?: unknown;
  constructor(msg: string, code: number | string, status?: number, raw?: unknown) {
    super(msg);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.raw = raw;
  }
}

function safeParseJson(x: any) {
  try {
    if (typeof x === "string") return JSON.parse(x);
    return x;
  } catch {
    return x;
  }
}

function throwNormalizedError(e: any): never {
  const resp = e?.response;
  const data = resp?.data;
  const err = data?.error ?? data;

  const status = resp?.status ?? err?.status ?? 0;
  const code = err?.code ?? status ?? "UNKNOWN";
  const msg =
    err?.message ||
    data?.message ||
    e?.message ||
    "요청 처리 중 오류가 발생했습니다.";

  if (resp) {
    console.debug("[saveMyPlace][HTTP ERROR]", {
      method: resp.config?.method,
      url: resp.config?.url,
      status,
      requestBody: safeParseJson(resp.config?.data),
      responseBody: data,
    });
  }
  throw new AppError(msg, code, status, e);
}

export async function saveMyPlace(body: SaveMyPlaceRequest): Promise<SaveMyPlaceData> {
  const payload: SaveMyPlaceRequest = {
    ...body,
    contentId: String(body.contentId),
  };

  try {
    console.debug("[saveMyPlace][REQUEST]", {
      method: "PUT",
      url: "/my/places/save",
      payload,
    });

    const { data, status, config } = await api.put<SaveMyPlaceData | Wrapped<SaveMyPlaceData>>("my/places/save", payload, {
       headers: { "Content-Type": "application/json" },
    });

    console.debug("[saveMyPlace][RESPONSE]", {
      status,
      url: config?.url,
      raw: data,
    });

    // 비래핑
    if ((data as any)?.placeId !== undefined) {
      return data as SaveMyPlaceData;
    }

    // 래핑
    const wrapped = data as Wrapped<SaveMyPlaceData>;
    if (typeof wrapped?.success === "boolean") {
      if (wrapped.success && wrapped.data) return wrapped.data;

      const em = wrapped?.error?.message || "요청이 실패했습니다.";
      const ec = wrapped?.error?.code ?? status ?? 400;
      const es = wrapped?.error?.status ?? status;
      throw new AppError(em, ec, es, wrapped?.error);
    }

    throw new AppError("알 수 없는 응답 형식입니다.", "UNEXPECTED_RESPONSE", status, data);
  } catch (e) {
    throwNormalizedError(e);
  }
}

// 기존 import 경로 호환
export { saveMyPlace as savePlace };
export { AppError };
