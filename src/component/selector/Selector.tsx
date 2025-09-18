// src/component/Selector.tsx
import { useEffect, useMemo, useState } from 'react';
import { getThemeGroups, type ThemeGroup } from '@/api/Selector/theme.api';

export type OnSelectExtra = {
  // 선택 코드 & 라벨 동시 제공 (mode='theme' 때 자동 세팅)
  cat1?: string | null;
  cat2?: string[];
  cat1Name?: string | null;
  cat2Names?: string[];
};

type BaseProps = {
  initialMain: string;
  initialSubs?: string[]; // 단일 선택이라 첫 번째만 반영
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

// 기존 사용: dataMap을 직접 주입
type ManualMode = BaseProps & {
  mode?: 'manual';
  dataMap: Record<string, string[]>;
};

// 새 사용: theme API에서 자동 로드
type ThemeMode = BaseProps & {
  mode: 'theme';
  dataMap?: never;
};

export type SelectorProps = ManualMode | ThemeMode;

const Selector = ({
  mode = 'manual',
  dataMap: dataMapProp,
  initialMain,
  initialSubs,
  onSelect,
  colorScheme = {},
}: SelectorProps) => {
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

  // theme 모드면 API 로드
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
        console.error('[Selector][theme][load error]', e);
        setGroups([]);
        setDataMap({});
      } finally {
        setLoading(false);
      }
    })();
  }, [mode]);

  // manual 모드에서 외부 dataMap이 바뀌면 반영
  useEffect(() => {
    if (mode === 'manual' && dataMapProp) setDataMap(dataMapProp);
  }, [mode, dataMapProp]);

  const firstMain = useMemo(() => Object.keys(dataMap)[0] ?? initialMain, [dataMap, initialMain]);

  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSub, setSelectedSub] = useState<string | null>(
    initialSubs && initialSubs.length ? initialSubs[0] : null,
  );

  // dataMap 변화 시 초기값 정합성 보정
  useEffect(() => {
    if (!dataMap[selectedMain]) {
      const fallback = dataMap[initialMain] ? initialMain : firstMain;
      setSelectedMain(fallback);
      const sub = initialSubs?.[0];
      setSelectedSub(sub && dataMap[fallback]?.includes(sub) ? sub : null);
    } else if (selectedSub && !dataMap[selectedMain]?.includes(selectedSub)) {
      setSelectedSub(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMap, firstMain]);

  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSub(null);
  };

  const chooseSub = (sub: string) => {
    setSelectedSub((prev) => (prev === sub ? null : sub));
  };

  // onSelect payload 구성(코드 포함)
  useEffect(() => {
    if (!onSelect) return;
    const names = selectedSub ? [selectedSub] : [];
    if (mode === 'theme') {
      const g = groups.find((gg) => gg.cat1Name === selectedMain);
      const cat1 = g?.cat1 ?? null;
      const cat2Names = names;
      const cat2 =
        g?.cat2List
          ?.filter((c) => cat2Names.includes(c.cat2Name))
          .map((c) => c.cat2) ?? [];

      onSelect(selectedMain, names, {
        cat1,
        cat2,
        cat1Name: g?.cat1Name ?? null,
        cat2Names,
      });
    } else {
      onSelect(selectedMain, names);
    }
  }, [mode, groups, onSelect, selectedMain, selectedSub]);

  return (
    <div className={`flex h-85 w-full overflow-hidden border-t ${borderColor}`}>
      <div className={`flex w-1/3 flex-col px-1 py-2 ${leftBase}`}>
        {loading && <div className="px-2 py-1 text-caption4 opacity-60">불러오는 중…</div>}
        {!loading &&
          Object.keys(dataMap).map((main) => (
            <button
              key={main}
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
            const active = selectedSub === sub;
            return (
              <button
                key={sub}
                onClick={() => chooseSub(sub)}
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

export default Selector;
