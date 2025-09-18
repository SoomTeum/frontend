import { useEffect, useMemo, useState } from 'react';
import Selector from './Selector';
import api from '@/api/api';

export type RegionSelectPayload = {
  region: string;
  sigungu?: string;
  areaCode: string | number;
  sigunguCode?: string | number;
};

type SigunguDto = { sigunguCode: string | number; sigunguName: string };
type AreaDto = { areaCode: string | number; areaName: string; sigunguList: SigunguDto[] };

function unwrap<T>(raw: any): T {
  return raw && typeof raw.success === 'boolean' && 'data' in raw ? raw.data : raw;
}

const norm = (s?: string | null) => (s ?? '').replace(/\u00A0/g, ' ').trim();

export default function RegionSelector({
  onChange,
}: {
  onChange?: (payload: RegionSelectPayload) => void;
}) {
  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});

  const [codeMap, setCodeMap] = useState<
    Record<string, { areaCode: string | number; sigunguMap: Record<string, string | number> }>
  >({});

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get('/places/regions');
        const list = unwrap<AreaDto[]>(res.data);

        const dm: Record<string, string[]> = {};
        const cm: Record<
          string,
          { areaCode: string | number; sigunguMap: Record<string, string | number> }
        > = {};

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

        if (!alive) return;
        setDataMap(dm);
        setCodeMap(cm);
      } catch (e) {
        if (!alive) return;
        setErr('지역 목록을 불러오지 못했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const initialMain = useMemo(() => {
    if (dataMap['인천']) return '인천';
    const keys = Object.keys(dataMap);
    return keys.length ? keys[0] : '';
  }, [dataMap]);

  if (loading) {
    return (
      <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">불러오는 중…</div>
    );
  }
  if (err) {
    return <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{err}</div>;
  }

  return (
    <Selector
      dataMap={dataMap}
      initialMain={initialMain}
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
        const sigungu = norm(subs?.[0]);

        const area = codeMap[region];
        const areaCode = area?.areaCode ?? '';
        const sigunguCode = sigungu ? area?.sigunguMap?.[sigungu] : undefined;

        onChange?.({ region, sigungu: sigungu || undefined, areaCode, sigunguCode });
      }}
    />
  );
}
