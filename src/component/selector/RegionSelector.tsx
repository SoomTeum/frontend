import { useMemo } from 'react';
import Selector from './Selector';
import { regionMap, normalizeRegionName } from '@/constants/regionMap';
import { getRegionCodes } from '@/utils/ktoMapping';

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
const norm = (s: string) => normalizeRegionName(s.replace(/\u00A0/g, ' ').trim());

export default function RegionSelector({
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
        leftBase: 'bg-orange text-black',
        leftItem: 'text-black',
        leftActive: 'bg-[#ffebd9] text-black',
        rightItem: 'text-black',
        rightActive: 'bg-orange text-black',
        borderColor: 'border-orange',
      }}
      onSelect={(main, subs) => {
        const region = norm(main);
        const sigungu = subs?.[0];

        const { areaCode, sigunguCode } = getRegionCodes(region, sigungu);

        onChange?.({ region, sigungu, areaCode, sigunguCode });
      }}
    />
  );
}
