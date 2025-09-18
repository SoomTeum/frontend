import { useEffect, useMemo, useState } from 'react';
import SelectorMulti from './SelectorMulti';
import api from '@/api/api';
import { cn } from '@/utils/cn';

type Props = {
  className?: string;
  onChange?: (main: string, subs: string[]) => void;
};

type Cat2Dto = { cat2: string; cat2Name: string };
type Cat1GroupDto = { cat1: string; cat1Name: string; cat2List: Cat2Dto[] };

function unwrap<T>(raw: any): T {
  return raw && typeof raw.success === 'boolean' && 'data' in raw ? raw.data : raw;
}

const norm = (s?: string | null) => (s ?? '').replace(/\u00A0/g, ' ').trim();

export default function TravelActivitySelector({ className, onChange }: Props) {
  const [groups, setGroups] = useState<Cat1GroupDto[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [codeMap, setCodeMap] = useState<
    Record<string, { cat1: string; cat2ByName: Record<string, string> }>
  >({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get('/places/themes');
        const list = unwrap<Cat1GroupDto[]>(res.data);

        const dm: Record<string, string[]> = {};
        const cm: Record<string, { cat1: string; cat2ByName: Record<string, string> }> = {};

        for (const g of list ?? []) {
          const cat1Name = norm(g.cat1Name);
          const cat2Names = (g.cat2List ?? []).map((c) => norm(c.cat2Name));

          dm[cat1Name] = cat2Names.length ? cat2Names : [cat1Name];

          const map: Record<string, string> = {};
          for (const c of g.cat2List ?? []) {
            map[norm(c.cat2Name)] = c.cat2;
          }
          cm[cat1Name] = { cat1: g.cat1, cat2ByName: map };
        }

        if (!alive) return;
        setGroups(list ?? []);
        setDataMap(dm);
        setCodeMap(cm);
      } catch (e) {
        if (!alive) return;
        setErr('테마 목록을 불러오지 못했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const initialMain = useMemo(() => {
    if (dataMap['자연']) return '자연';
    const keys = Object.keys(dataMap);
    return keys.length ? keys[0] : '';
  }, [dataMap]);

  if (loading) {
    return (
      <div className={cn('rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600', className)}>
        불러오는 중…
      </div>
    );
  }
  if (err) {
    return (
      <div className={cn('rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700', className)}>
        {err}
      </div>
    );
  }
  if (!initialMain) return null;

  return (
    <div className={cn('w-full', className)}>
      <SelectorMulti
        dataMap={dataMap}
        initialMain={initialMain}
        colorScheme={{
          leftBase: 'bg-red2 text-black text-caption4',
          leftItem: 'text-black text-caption4',
          leftActive: 'bg-pink text-black text-caption4',
          rightItem: 'text-black',
          rightActive: 'bg-red2 text-black text-caption4',
          borderColor: 'border-red2',
        }}
        onSelect={(main, subs) => {
          onChange?.(norm(main), subs.map(norm));

          // 만약 이후에 코드가 필요하면 codeMap으로 역조회 가능:
          // const cat1Code = codeMap[norm(main)]?.cat1;
          // const cat2Codes = subs.map((s) => codeMap[norm(main)]?.cat2ByName[norm(s)]);
          // console.log(cat1Code, cat2Codes);
        }}
      />
    </div>
  );
}
