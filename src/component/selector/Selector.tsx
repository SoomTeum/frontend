// Selector.tsx
import { useEffect, useState } from 'react';

export type SelectorProps = {
  dataMap: Record<string, string[]>;
  initialMain: string;
  onSelect?: (main: string, subs: string[]) => void;
  initialSubs?: string[];
  colorScheme?: {
    leftBase?: string;
    leftItem?: string;
    leftActive?: string;
    rightItem?: string;
    rightActive?: string;
    borderColor?: string;
  };
};

const Selector = ({
  dataMap,
  initialMain,
  onSelect,
  initialSubs,
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

  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSub, setSelectedSub] = useState<string | null>(
    initialSubs && initialSubs.length ? initialSubs[0] : null,
  );

  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSub(null);
  };
  const chooseSub = (sub: string) => {
    setSelectedSub((prev) => (prev === sub ? null : sub));
  };

  useEffect(() => setSelectedMain(initialMain), [initialMain]);
  useEffect(() => {
    if (initialSubs !== undefined) {
      setSelectedSub(initialSubs.length ? initialSubs[0] : null);
    }
  }, [initialSubs]);
  useEffect(() => {
    onSelect?.(selectedMain, selectedSub ? [selectedSub] : []);
  }, [selectedMain, selectedSub, onSelect]);

  return (
    <div className={`flex h-85 w-full overflow-hidden border-t ${borderColor}`}>
      <div className={`flex w-1/3 flex-col px-1 py-2 ${leftBase}`}>
        {Object.keys(dataMap).map((main) => (
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
        {dataMap[selectedMain]?.length ? (
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
