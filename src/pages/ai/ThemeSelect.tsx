import SelectorMulti from '@/component/selector/SelectorMulti';
import { activityMap } from '@/constants/ActivityMap';
import { ArrowLeft } from '@/assets';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAIExploreStore } from '@/stores/useAIExploreStore';
import { Button } from '@/component';

const ThemeSelcetPage = () => {
  const navigate = useNavigate();
  const saved = useAIExploreStore((s) => s.theme);
  const setTheme = useAIExploreStore((s) => s.setTheme);
  const firstMain = Object.keys(activityMap)[0] ?? '자연';
  const [main, setMain] = useState<string>(saved?.main ?? firstMain);
  const [subs, setSubs] = useState<string[]>(saved?.subs ?? []);

  const done = () => {
    setTheme({ main, subs });
    navigate('/explore');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-green3-light relative h-10 w-full">
        <button onClick={() => navigate(-1)} className="absolute top-1/2 -translate-y-1/2 pl-4">
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
        <SelectorMulti
          dataMap={activityMap}
          initialMain={main}
          initialSubs={subs}
          colorScheme={{
            leftBase: 'bg-green3-light text-caption4',
            leftItem: 'text-black text-caption4',
            leftActive: 'bg-green0',
            rightItem: 'text-black',
            rightActive: 'outline outline-1 outline-[var(--color-green3)]',
            borderColor: 'border-green3',
          }}
          onSelect={(m, s) => {
            setMain(m);
            setSubs(s);
          }}
        />

        <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
          <Button
            variant="lg"
            color="green3"
            className="w-full"
            disabled={!subs.length}
            onClick={done}
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelcetPage;
