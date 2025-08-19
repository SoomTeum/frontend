import { Header, PlaceCard, Sidebar } from '@/component';
import { useState } from 'react';
import { mockAICard } from '@/__mocks/AICard.mock';

function getRankBadgeClass(n: number) {
  if (n === 1) return 'bg-red1 text-black';
  if (n === 2) return 'bg-orange text-black';
  if (n === 3) return 'bg-mint text-black';
  return 'bg-gray1 text-gray-700';
}

export default function AIResultPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  //투두: 추후 API 연결하면서 로딩 화면 연결

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" />{' '}
      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          AI 맞춤 여행지 탐색
        </div>
        <ul className="w-full space-y-4 py-5 pr-8 pl-5">
          {mockAICard.map((it, idx) => {
            const rank = idx + 1;
            return (
              <li key={it.id}>
                <div className="flex items-center gap-3">
                  {/*순위*/}
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold shadow-sm ${getRankBadgeClass(rank)}`}
                  >
                    {rank}
                  </span>

                  <div className="flex-1">
                    <PlaceCard
                      imgUrl={it.thumbnail}
                      title={it.name}
                      theme={it.themeTag}
                      quietLevel={it.serenity}
                      likeCount={it.likeCount}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
