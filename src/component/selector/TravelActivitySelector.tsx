import { useEffect, useMemo, useState, useCallback } from "react";
import SelectorMulti from "./SelectorMulti";
import { cn } from "@/utils/cn";
import { getThemeGroups, type ThemeGroup } from "@/api/Selector/theme.api";

type Props = {
  className?: string;
  onChange?: (main: string, subs: string[]) => void;
  onChangeCodes?: (cat1?: string, cat2?: string[]) => void;
  onReadyChange?: (
    ready: boolean,
    payload: { main: string; subs: string[]; cat1?: string; cat2?: string[] }
  ) => void;
};

const norm = (s?: string | null) => (s ?? "").replace(/\u00A0/g, " ").trim();
const arrEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

function isIgnorableCancel(err: any): boolean {
  const msg = String(err?.message || "");
  const code = String(err?.code || "");
  return (
    err?.name === "AbortError" ||
    err?.__CANCEL__ === true ||
    code === "ERR_CANCELED" ||
    code === "CANCELED" ||
    /abort|cancell?ed/i.test(msg)
  );
}

export default function TravelActivitySelector({
  className,
  onChange,
  onChangeCodes,
  onReadyChange,
}: Props) {
  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [codeMap, setCodeMap] = useState<
    Record<string, { cat1: string; cat2ByName: Record<string, string> }>
  >({});

  const [selectedMain, setSelectedMain] = useState<string>("");
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const groups: ThemeGroup[] = await getThemeGroups({ signal: controller.signal });
        setErr(null);

        const dm: Record<string, string[]> = {};
        const cm: Record<string, { cat1: string; cat2ByName: Record<string, string> }> = {};
        for (const g of groups ?? []) {
          const cat1Name = norm(g.cat1Name);
          const cat2Names = (g.cat2List ?? []).map((c) => norm(c.cat2Name));
          dm[cat1Name] = cat2Names;
          const map: Record<string, string> = {};
          for (const c of g.cat2List ?? []) map[norm(c.cat2Name)] = c.cat2;
          cm[cat1Name] = { cat1: g.cat1, cat2ByName: map };
        }
        setDataMap(dm);
        setCodeMap(cm);
      } catch (e: any) {
        if (controller.signal.aborted || isIgnorableCancel(e)) return;
        console.error("[TravelActivitySelector] load error:", e);
        setErr(e?.message || "테마 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const initialMain = useMemo(() => {
    if (dataMap["자연"]) return "자연";
    const keys = Object.keys(dataMap);
    return keys.length ? keys[0] : "";
  }, [dataMap]);

  const colorScheme = useMemo(
    () => ({
      leftBase: "bg-red2 text-black text-caption4",
      leftItem: "text-black text-caption4",
      leftActive: "bg-pink text-black text-caption4",
      rightItem: "text-black",
      rightActive: "bg-red2 text-black text-caption4",
      borderColor: "border-red2",
    }),
    []
  );
  const handleSelect = useCallback(
    (main: string, subs: string[]) => {
      const m = norm(main);
      const s = subs.map(norm);

      const sameMain = m === selectedMain;
      const sameSubs = arrEqual(s, selectedSubs);
      if (sameMain && sameSubs) return;

      setSelectedMain((prev) => (prev === m ? prev : m));
      setSelectedSubs((prev) => (arrEqual(prev, s) ? prev : s));

      if (!sameMain || !sameSubs) {
        onChange?.(m, s);
        const c1 = codeMap[m]?.cat1;
        const c2 = s.map((x) => codeMap[m]?.cat2ByName[norm(x)]).filter(Boolean) as string[];
        onChangeCodes?.(c1, c2);
      }
    },
    [selectedMain, selectedSubs, onChange, onChangeCodes, codeMap]
  );

  useEffect(() => {
    const main = selectedMain;
    const subs = selectedSubs;
    const c1 = main ? codeMap[main]?.cat1 : undefined;
    const c2 = main
      ? (subs.map((x) => codeMap[main]?.cat2ByName[norm(x)]).filter(Boolean) as string[])
      : [];
    const ready = !!main && subs.length > 0;
    onReadyChange?.(ready, { main, subs, cat1: c1, cat2: c2 });
  }, [selectedMain, selectedSubs, codeMap, onReadyChange]);

  if (loading) {
    return (
      <div className={cn("rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600", className)}>
        불러오는 중…
      </div>
    );
  }
  const hasData = Object.keys(dataMap).length > 0;
  if (err && !hasData) {
    return (
      <div className={cn("rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700", className)}>
        {err}
      </div>
    );
  }
  if (!initialMain) {
    return (
      <div className={cn("rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600", className)}>
        표시할 테마가 없습니다.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <SelectorMulti
        dataMap={dataMap}
        initialMain={initialMain}
        colorScheme={colorScheme}        
        onSelect={handleSelect}            
      />
    </div>
  );
}
