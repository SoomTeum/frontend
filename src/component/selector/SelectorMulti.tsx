import { useEffect, useState } from 'react';

export type SelectorMultiProps = {
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

const SelectorMulti = ({
  dataMap,
  initialMain,
  onSelect,
  initialSubs,
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

  const [selectedMain, setSelectedMain] = useState(initialMain);

  const [selectedSubs, setSelectedSubs] = useState<string[]>(
    initialSubs && initialSubs.length ? [initialSubs[0]] : [],
  );

  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSubs([]);
  };

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) => (prev[0] === sub ? [] : [sub]));
  };

  useEffect(() => {
    setSelectedMain(initialMain);
  }, [initialMain]);

  useEffect(() => {
    if (initialSubs !== undefined) {
      setSelectedSubs(initialSubs.length ? [initialSubs[0]] : []);
    }
  }, [initialSubs]);

  useEffect(() => {
    onSelect?.(selectedMain, selectedSubs);
  }, [selectedMain, selectedSubs, onSelect]);

  return (
    <div className={`flex h-80 w-full overflow-hidden border-t ${borderColor}`}>
      <div className={`flex w-1/3 flex-col px-1 py-2 ${leftBase}`}>
        {Object.keys(dataMap).map((main) => (
          <button
            key={main}
            type="button"
            onClick={() => changeMain(main)}
            className={`text-caption4 mx-1 mb-1 cursor-pointer rounded-l px-1 py-1 text-center ${
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
            const active = selectedSubs[0] === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSub(sub)}
                className={`text-caption4 mx-2 mb-1 ml-5 w-3/7 cursor-pointer rounded-l px-2 py-1 text-center ${
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
