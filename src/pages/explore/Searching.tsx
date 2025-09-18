import { Loader } from '@/component';
import bubbleUrl from '@/image/Searching.svg';
import personUrl from '@/image/Searching2.svg';

type Props = {
  open: boolean;
  text?: string;
};

export default function SearchingOverlay({
  open,
  text = '당신의 취향에 맞는 여행지를 찾고 있습니다…',
}: Props) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-green3 inset-0 z-[2000] flex min-h-screen w-full flex-col items-center justify-center"
    >
      <Loader className="mb-1 h-[300px] w-[300px]" />
      <img
        src={bubbleUrl}
        alt={text}
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
