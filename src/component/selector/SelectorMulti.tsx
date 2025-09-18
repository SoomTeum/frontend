// src/component/SelectorMulti.tsx
import { useEffect, useMemo, useState } from 'react';
import { getThemeGroups, type ThemeGroup } from '@/api/Selector/theme.api';

export type OnSelectExtra = {
  cat1?: string | null;
  cat2?: string[];          // 단일 선택이지만 호환 위해 배열 유지([code] 또는 [])
  cat1Name?: string | null;
  cat2Names?: string[];     // 단일 선택이지만 호환 위해 배열 유지([name] 또는 [])
};

type BaseProps = {
  initialMain: string;
  initialSubs?: string[];   // 단일 선택 모드에서도 첫 번째 값만 사용
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

  // ── 테마 모드: 원격 그룹 불러오기
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

  // ── 매뉴얼 모드: 외부 dataMap 갱신 반영
  useEffect(() => {
    if (mode === 'manual' && dataMapProp) setDataMap(dataMapProp);
  }, [mode, dataMapProp]);

  const firstMain = useMemo(() => Object.keys(dataMap)[0] ?? initialMain, [dataMap, initialMain]);

  // ── 선택 상태(단일 선택)
  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSub, setSelectedSub] = useState<string | null>(
    initialSubs && initialSubs.length ? initialSubs[0] : null,
  );

  // ── dataMap 변동 시 선택값 유효성 보정
  useEffect(() => {
    // 메인 유효성 체크
    let nextMain = selectedMain;
    if (!dataMap[selectedMain]) {
      nextMain = dataMap[initialMain] ? initialMain : firstMain;
      setSelectedMain(nextMain);
    }

    // 서브 유효성 체크 (단일)
    const subs = dataMap[nextMain] ?? [];
    if (!selectedSub || !subs.includes(selectedSub)) {
      // initialSubs 중 현재 메인에서 유효한 첫 값, 없으면 null
      const candidate =
        (initialSubs ?? []).find((s) => subs.includes(s)) ?? null;
      setSelectedSub(candidate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMap, firstMain]);

  // ── 메인 변경 시 서브 리셋
  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSub(null); // 메인 바꾸면 서브 초기화
  };

  // ── 서브 단일 토글(같은 것 클릭 시 해제)
  const toggleSub = (sub: string) => {
    setSelectedSub((prev) => (prev === sub ? null : sub));
  };

  // ── 상위로 변경 알림
  useEffect(() => {
    if (!onSelect) return;

    const subsArr = selectedSub ? [selectedSub] : [];

    if (mode === 'theme') {
      const g = groups.find((gg) => gg.cat1Name === selectedMain);
      const picked = selectedSub
        ? g?.cat2List.find((c) => c.cat2Name === selectedSub)
        : undefined;

      const cat1 = g?.cat1 ?? null;
      const cat2 = picked?.cat2 ? [picked.cat2] : [];
      const cat1Name = g?.cat1Name ?? null;
      const cat2Names = selectedSub ? [selectedSub] : [];

      onSelect(selectedMain, subsArr, {
        cat1,
        cat2,
        cat1Name,
        cat2Names,
      });
    } else {
      onSelect(selectedMain, subsArr);
    }
  }, [mode, groups, onSelect, selectedMain, selectedSub]);

  return (
    <div className={`flex h-80 w-full overflow-hidden border-t ${borderColor}`}>
      {/* 메인 리스트 */}
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

      {/* 서브 리스트(단일 선택) */}
      <div className="min-h-col flex w-2/3 flex-col gap-2 overflow-y-auto py-2">
        {loading ? (
          <div className="text-gray1 flex flex-1 items-center justify-center text-center">…</div>
        ) : (dataMap[selectedMain]?.length ?? 0) > 0 ? (
          dataMap[selectedMain].map((sub) => {
            const active = selectedSub === sub;
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
