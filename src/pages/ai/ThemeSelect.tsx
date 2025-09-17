// ThemeSelcetPage.tsx
import { Selector } from '@/component';
import { ArrowLeft } from '@/assets';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAIExploreStore } from '@/stores/useAIExploreStore';
import { Button } from '@/component';
import { getThemeGroups, type ThemeGroup } from '@/api/Selector/theme.api';

const ThemeSelcetPage = () => {
  const navigate = useNavigate();
  const saved = useAIExploreStore((s) => s.theme);
  const setTheme = useAIExploreStore((s) => s.setTheme);
  const setThemeCodes = useAIExploreStore((s) => s.setThemeCodes);

  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const groups = await getThemeGroups();
        const next: Record<string, string[]> = {};
        groups.forEach((g: ThemeGroup) => {
          next[g.cat1Name] = g.cat2List.map((c) => c.cat2Name);
        });
        setDataMap(next);
      } catch (e) {
        console.error(e);
        setDataMap({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstMain = useMemo(() => Object.keys(dataMap)[0] ?? '자연', [dataMap]);

  const [main, setMain] = useState<string>(saved?.main ?? firstMain);
  const [subs, setSubs] = useState<string[]>(saved?.subs ?? []);

  useEffect(() => {
    if (!dataMap[main]) {
      setMain(saved?.main && dataMap[saved.main] ? saved.main : firstMain);
      const validSubs = (saved?.subs ?? []).filter((s) =>
        dataMap[saved?.main ?? firstMain]?.includes(s),
      );
      setSubs(validSubs);
    } else {
      setSubs((prev) => prev.filter((s) => dataMap[main]?.includes(s)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMap, firstMain]);

  const handleSelect = useCallback(
    (selectedMain: string, selectedSubs: string[], meta?: any) => {
      setMain(selectedMain);
      setSubs(selectedSubs);
      setTheme({ main: selectedMain, subs: selectedSubs });

      const cat1: string | null = meta?.mainCode ?? meta?.cat1 ?? null;

      const cat2: string[] = Array.isArray(meta?.subCodes)
        ? meta.subCodes
        : Array.isArray(meta?.cat2)
          ? meta.cat2
          : Array.isArray(meta?.subs)
            ? meta.subs.map((s: any) => s.code).filter(Boolean)
            : [];

      setThemeCodes({ cat1, cat2 });
    },
    [setTheme, setThemeCodes],
  );

  const done = () => {
    setTheme({ main, subs });
    navigate('/explore', { replace: true });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-green3-light relative h-10 w-full">
        <button
          onClick={() => navigate('/explore', { replace: true })}
          className="absolute top-1/2 -translate-y-1/2 pl-4"
        >
          <ArrowLeft className="w-4" />
        </button>
        <span className="text-caption3 text-green1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          AI 맞춤 여행지 탐색 테마
        </span>
      </div>

      <div className="px-9">
        <div className="border-green3 mt-5 border-t">
          <h2 className="text-title4 text-green1 py-2 text-center">테마</h2>
        </div>

        <Selector
          key={`${Object.keys(dataMap).length}-${main}-${subs.join(',')}`} // 데이터 로드 시 초기값 반영 보장
          dataMap={dataMap}
          initialMain={main}
          initialSubs={subs}
          onSelect={handleSelect}
          colorScheme={{
            leftBase: 'bg-green3-light text-caption4',
            leftItem: 'text-black text-caption4',
            leftActive: 'bg-green0',
            rightItem: 'text-black',
            rightActive: 'outline outline-1 outline-[var(--color-green3)]',
            borderColor: 'border-green3',
          }}
        />

        <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
          <Button
            variant="lg"
            color="green3"
            className="w-full"
            disabled={loading || !subs.length}
            onClick={done}
          >
            {loading ? '불러오는 중…' : '완료'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelcetPage;
