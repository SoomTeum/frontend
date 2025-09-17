// src/pages/Filter/RegionSelector.tsx  (경로는 너 프로젝트 구조에 맞게)
// 현재 파일에 아래처럼 반영하면 됨

import { useMemo } from "react";
import Selector from "./Selector"; // 네 코드 기준 이름
import { regionMap, normalizeRegionName } from "@/constants/regionMap";
import { getRegionCodes } from "@/utils/ktoMapping"; // ⬅️ 추가!

// 부모에게 넘길 payload 타입 (권장)
export type RegionSelectPayload = {
  region: string;
  sigungu?: string;
  areaCode: number | string;
  sigunguCode?: number | string;
};

function buildRegionDataMap() {
  const m: Record<string, string[]> = {};
  for (const [region, info] of Object.entries(regionMap)) {
    const subs = info.sigungu ? Object.keys(info.sigungu) : [region];
    m[region] = subs;
  }
  return m;
}

const REGION_DATA_MAP: Record<string, string[]> = buildRegionDataMap();
const norm = (s: string) => normalizeRegionName(s.replace(/\u00A0/g, " ").trim());

export default function RegionSelector({
  // ✅ 부모는 이제 '코드까지 포함'된 객체를 받게 됨
  onChange,
}: {
  onChange?: (payload: RegionSelectPayload) => void;
}) {
  const dataMap = useMemo(() => REGION_DATA_MAP, []);

  return (
    <Selector
      dataMap={dataMap}
      initialMain="인천"
      colorScheme={{
        leftBase: "bg-[var(--color-orange)] text-black",
        leftItem: "text-black",
        leftActive: "bg-white text-black",
        rightItem: "text-black",
        rightActive: "bg-[var(--color-green3-light)] text-black",
        borderColor: "border-[var(--color-orange)]",
      }}
      onSelect={(main, subs) => {
        const region = norm(main);
        const sigungu = subs?.[0];

        // ⬇️ 매핑 적용: 라벨 → 코드
        const { areaCode, sigunguCode } = getRegionCodes(region, sigungu);

        onChange?.({ region, sigungu, areaCode, sigunguCode });
      }}
    />
  );
}
