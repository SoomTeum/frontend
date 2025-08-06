import { useState, useEffect } from 'react';

export type SelectorProps = {
  dataMap: Record<string, string[]>;
  initialMain: string;
  colorScheme?: {
    base: string;
    active: string;
    text: string;
    rightActive: string;
  };
  onSelect?: (main: string, sub: string | null) => void;
};

const Selector = ({
  dataMap,
  initialMain,
  colorScheme = {
    base: 'bg-rose-300',
    active: 'bg-rose-100 text-rose-800',
    text: 'text-white',
    rightActive: 'bg-rose-100 text-rose-800 font-bold',
  },
  onSelect,
}: SelectorProps) => {
  const [selectedMain, setSelectedMain] = useState(initialMain);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  useEffect(() => {
    if (onSelect) onSelect(selectedMain, selectedSub);
  }, [selectedMain, selectedSub]);

  return (
    <div className="flex w-full max-w-md h-[400px] rounded-xl overflow-hidden shadow-md">
 
      <div className={`w-1/2 flex flex-col justify-start items-stretch py-2 ${colorScheme.base}`}>
        {Object.keys(dataMap).map((main) => (
          <button
            key={main}
            onClick={() => {
              setSelectedMain(main);
              setSelectedSub(null);
            }}
            className={`py-2 px-2 text-center text-sm ${
              selectedMain === main
                ? `${colorScheme.active} font-bold rounded-md mx-1`
                : `${colorScheme.text}`
            }`}
          >
            {main}
          </button>
        ))}
      </div>

      <div className="w-1/2 flex flex-col justify-start items-stretch py-2 bg-white">
        {dataMap[selectedMain].length > 0 ? (
          dataMap[selectedMain].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              className={`py-2 px-2 text-center text-sm rounded-md mx-1 mb-1 ${
                selectedSub === sub
                  ? `${colorScheme.rightActive}`
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              {sub}
            </button>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400">
            해당 항목 없음
          </div>
        )}
      </div>
    </div>
  );
};

export default Selector;
