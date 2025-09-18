import { Loader } from '@/component';
import bubbleUrl from '@/image/Searching.svg';
import personUrl from '@/image/Searching2.svg';

export default function SearchingPage() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[var(--color-green3)]">
      <Loader className="mb-1 h-[300px] w-[300px]" />
      <img
        src={bubbleUrl}
        alt="당신의 취향에 맞는 여행지를 찾고 있습니다…"
        className="w-[80%] max-w-xs drop-shadow-sm select-none"
        draggable={false}
      />
      <img
        src={personUrl}
        alt="검색 일러스트"
        className="mt-6 w-[62%] max-w-[260px] select-none"
        draggable={false}
      />
    </div>
  );
}
