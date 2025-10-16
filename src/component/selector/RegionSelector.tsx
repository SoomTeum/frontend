// src/component/selector/RegionSelector.tsx
import { useEffect, useMemo, useState } from "react";
import Selector from "./Selector";
import { fetchRegions, type AreaDto } from "@/api/Selector/region.api";

export type RegionSelectPayload = {
  region: string;
  sigungu?: string;
  areaCode: string | number;
  sigunguCode?: string | number;
};

const norm = (s?: string | null) => (s ?? "").replace(/\u00A0/g, " ").trim();

export default function RegionSelector({
  onChange,
}: { onChange?: (payload: RegionSelectPayload) => void }) {
  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
  const [codeMap, setCodeMap] = useState<
    Record<string, { areaCode: string | number; sigunguMap: Record<string, string | number> }>
  >({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list: AreaDto[] = await fetchRegions({ signal: controller.signal });

        // 성공 시 에러 확실히 초기화
        setErr(null);

        const dm: Record<string, string[]> = {};
        const cm: Record<string, { areaCode: string | number; sigunguMap: Record<string, string | number> }> = {};

        for (const area of list ?? []) {
          const areaName = norm(area.areaName);
          const sigs = (area.sigunguList ?? []).map((s) => norm(s.sigunguName));
          dm[areaName] = sigs.length ? sigs : [areaName];

          const sigMap: Record<string, string | number> = {};
          for (const s of area.sigunguList ?? []) {
            sigMap[norm(s.sigunguName)] = s.sigunguCode;
          }
          cm[areaName] = { areaCode: area.areaCode, sigunguMap: sigMap };
        }

        setDataMap(dm);
        setCodeMap(cm);
      } catch (e: any) {
        // ⚠️ 이 effect의 요청이 취소돼서 난 에러라면 무시
        if (controller.signal.aborted) return;

        // axios 취소 패턴들 — 인터셉터가 UNKNOWN으로 바꿔도 걸러지게 넓게 체크
        const msg = String(e?.message || "");
        const code = String(e?.code || "");
        if (
          e?.name === "AbortError" ||
          e?.__CANCEL__ === true ||
          code === "ERR_CANCELED" ||
          code === "CANCELED" ||
          /abort|cancell?ed/i.test(msg)
        ) {
          return;
        }

        console.error("[RegionSelector] load error:", e);
        setErr(e?.message || "네트워크 오류 또는 서버 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const initialMain = useMemo(() => {
    if (dataMap["인천"]) return "인천";
    const keys = Object.keys(dataMap);
    return keys.length ? keys[0] : "";
  }, [dataMap]);

  // 로딩 UI
  if (loading) {
    return (
      <div
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600"
        role="status"
        aria-live="polite"
      >
        불러오는 중…
      </div>
    );
  }

  // ✅ 데이터가 있으면 에러 배너는 숨김 (취소로 인한 가짜 에러 방지)
  const hasData = Object.keys(dataMap).length > 0;

  if (err && !hasData) {
    return (
      <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700" role="alert">
        {err}
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
        표시할 지역이 없습니다.
      </div>
    );
  }

  return (
    <Selector
      dataMap={dataMap}
      initialMain={initialMain}
      colorScheme={{
        leftBase: "bg-orange text-black",
        leftItem: "text-black",
        leftActive: "bg-[#ffebd9] text-black",
        rightItem: "text-black",
        rightActive: "bg-orange text-black",
        borderColor: "border-orange",
      }}
      onSelect={(main, subs) => {
        const region = norm(main);
        const sigungu = norm(subs?.[0]);

        const area = codeMap[region];
        const areaCode = area?.areaCode ?? "";
        const sigunguCode = sigungu ? area?.sigunguMap?.[sigungu] : undefined;

        onChange?.({ region, sigungu: sigungu || undefined, areaCode, sigunguCode });
      }}
    />
  );
}
