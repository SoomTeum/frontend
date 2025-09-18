// src/component/SelectorMulti.tsx
import { useEffect, useMemo, useState } from 'react';
import { getThemeGroups, type ThemeGroup } from '@/api/Selector/theme.api';

export type OnSelectExtra = {
  cat1?: string | null;
  cat2?: string[];
  cat1Name?: string | null;
  cat2Names?: string[];
};

type BaseProps = {
  initialMain: string;
  initialSubs?: string[];
  onSelect?: (main: string, subs: string[], extra?: OnSelectExtra) => void;
  colorScheme?: {
    leftBase?: string;
    leftItem?: string;
    leftActive?: string;
    rightItem?: string;
    rightActive?: string;
    borderColor?: string;
  };
};

type ManualMode = BaseProps & {
  mode?: 'manual';
  dataMap: Record<string, string[]>;
};

type ThemeMode = BaseProps & {
  mode: 'theme';
  dataMap?: never;
};

export type SelectorMultiProps = ManualMode | ThemeMode;

const SelectorMulti = ({
  mode = 'manual',
  dataMap: dataMapProp,
  initialMain,
  initialSubs,
  onSelect,
  colorScheme = {},
}: SelectorMultiProps) => {
  const {
    leftBase = 'bg-green3-light',
    leftItem = 'text-black text-caption4',
    leftActive = 'bg-green0 text-caption4',
    rightItem = 'text-green1',
    rightActive = 'bg-green4 text-black text-caption4',
    borderColor = 'border-green3',
  } = colorScheme;

  const [loading, setLoading] = useState(mode === 'theme');
  const [groups, setGroups] = useState<ThemeGroup[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, string[]>>(
    mode === 'manual' ? (dataMapProp as Record<string, string[]>) : {},
  );

  useEffect(() => {
    if (mode !== 'theme') return;
    (async () => {
      try {
        setLoading(true);
        const gs = await getThemeGroups();
        setGroups(gs);
        const map: Record<string, string[]> = {};
        gs.forEach((g) => (map[g.cat1Name] = g.cat2List.map((c) => c.cat2Name)));
        setDataMap(map);
      } catch (e) {
        console.error('[SelectorMulti][theme][load error]', e);
        setGroups([]);
        setDataMap({});
      } finally {
        setLoading(false);
      }
    })();
  }, [mode]);

  useEffect(() => {
    if (mode === 'manual' && dataMapProp) setDataMap(dataMapProp);
  }, [mode, dataMapProp]);

  const firstMain = useMemo(() => Object.keys(dataMap)[0] ?? initialMain, [dataMap, initialMain]);

  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSubs, setSelectedSubs] = useState<string[]>(
    initialSubs && initialSubs.length ? [...initialSubs] : [],
  );

  useEffect(() => {
    if (!dataMap[selectedMain]) {
      const fallback = dataMap[initialMain] ? initialMain : firstMain;
      setSelectedMain(fallback);
      const valid = (initialSubs ?? []).filter((s) => dataMap[fallback]?.includes(s));
      setSelectedSubs(valid);
    } else {
      setSelectedSubs((prev) => prev.filter((s) => dataMap[selectedMain]?.includes(s)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMap, firstMain]);

  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSubs([]); // 메인 바꾸면 서브 리셋
  };

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) => (prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]));
  };

  useEffect(() => {
    if (!onSelect) return;
    if (mode === 'theme') {
      const g = groups.find((gg) => gg.cat1Name === selectedMain);
      const cat1 = g?.cat1 ?? null;
      const cat2Names = [...selectedSubs];
      const cat2 =
        g?.cat2List
          ?.filter((c) => cat2Names.includes(c.cat2Name))
          .map((c) => c.cat2) ?? [];

      onSelect(selectedMain, [...selectedSubs], {
        cat1,
        cat2,
        cat1Name: g?.cat1Name ?? null,
        cat2Names,
      });
    } else {
      onSelect(selectedMain, [...selectedSubs]);
    }
  }, [mode, groups, onSelect, selectedMain, selectedSubs]);

  return (
    <div className={`flex h-80 w-full overflow-hidden border-t ${borderColor}`}>
      <div className={`flex w-1/3 flex-col px-1 py-2 ${leftBase}`}>
        {loading && <div className="px-2 py-1 text-caption4 opacity-60">불러오는 중…</div>}
        {!loading &&
          Object.keys(dataMap).map((main) => (
            <button
              key={main}
              type="button"
              onClick={() => changeMain(main)}
              className={`text-caption4 mx-1 mb-1 rounded-l px-1 py-1 text-center ${
                selectedMain === main ? leftActive : leftItem
              }`}
            >
              {main}
            </button>
          ))}
      </div>

      <div className="min-h-col flex w-2/3 flex-col gap-2 overflow-y-auto py-2">
        {loading ? (
          <div className="text-gray1 flex flex-1 items-center justify-center text-center">…</div>
        ) : dataMap[selectedMain]?.length ? (
          dataMap[selectedMain].map((sub) => {
            const active = selectedSubs.includes(sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSub(sub)}
                className={`text-caption4 mx-2 mb-1 ml-5 w-3/7 rounded-l px-2 py-1 text-center ${
                  active ? rightActive : rightItem
                }`}
              >
                {sub}
              </button>
            );
          })
        ) : (
          <div className="text-gray1 flex flex-1 items-center justify-center text-center">
            해당 항목 없음
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectorMulti;
