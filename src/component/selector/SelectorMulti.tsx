import { useEffect, useState } from 'react';

export type SelectorMultiProps = {
  dataMap: Record<string, string[]>;
  initialMain: string;
  onSelect?: (main: string, subs: string[]) => void;
  initialSubs?: string[];

  // 색상 커스터마이징
  colorScheme?: {
    leftBase?: string; //좌측 배경
    leftItem?: string; //좌측 기본 텍스트
    leftActive?: string; //좌측 활성 상태
    rightItem?: string; //우측 기본 텍스트
    rightActive?: string; //우측 활성 상태
  };
};

const SelectorMulti = ({
  dataMap,
  initialMain,
  onSelect,
  initialSubs = [],
  colorScheme = {},
}: SelectorMultiProps) => {
  const {
    leftBase = 'bg-green3-light',
    leftItem = 'text-black text-caption4',
    leftActive = 'bg-green0 text-caption4',
    rightItem = 'text-green1',
    rightActive = 'bg-green4 text-black text-caption4',
  } = colorScheme;

  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSubs, setSelectedSubs] = useState<string[]>(initialSubs);

  const changeMain = (next: string) => {
    setSelectedMain(next);
    setSelectedSubs([]); // 다른 대분류로 바꾸면 선택 초기화하기...
  };

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  useEffect(() => {
    onSelect?.(selectedMain, selectedSubs);
  }, [selectedMain, selectedSubs, onSelect]);

  return (
    <div className="border-green3 flex h-[400px] w-full overflow-hidden border-t">
      {/*대분류*/}
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

      {/*소분류*/}
      <div className="min-h-col scrollbar-hidden flex w-2/3 flex-col gap-2 overflow-y-auto py-2">
        {dataMap[selectedMain]?.length ? (
          dataMap[selectedMain].map((sub) => {
            const active = selectedSubs.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => toggleSub(sub)}
                className={`text-caption4 mx-2 mb-1 ml-5 w-1/2 rounded-l px-2 py-1 text-center ${
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
