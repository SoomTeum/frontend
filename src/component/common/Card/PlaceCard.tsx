import { Badge } from '@/component';
import { HeartFillIcon, CancelIcon, ImageIcon } from '@/assets';

type PlaceCardProps = {
  imgUrl?: string;
  title: string;
  theme: string;
  quietLevel: number;
  likeCount: number;
  showRemoveButton?: boolean;
  onRemove?: () => void;
};

export default function PlaceCard({
  imgUrl,
  title,
  theme,
  quietLevel,
  likeCount,
  showRemoveButton,
  onRemove,
}: PlaceCardProps) {
  return (
    <div className="bg-yellow2 flex h-19 w-full max-w-[430px] cursor-pointer items-start rounded-[10px] px-3 py-2 transition-all hover:scale-[1.01] hover:shadow-md active:scale-95">
      {/*썸네일*/}
      <div className="bg-gray1 flex aspect-square w-15 flex-shrink-0 items-center justify-center overflow-hidden rounded-[5px]">
        {imgUrl ? (
          <img src={imgUrl} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8" />
        )}
      </div>

      {/*텍스트*/}
      <div className="ml-4 flex w-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-caption4 truncate font-medium">{title}</p>
        </div>

        {/* 뱃지 2개 */}
        <div className="mt-5 flex shrink-0 gap-3">
          <Badge type="default" color="green" count={quietLevel}>
            한적함
          </Badge>
          <Badge type="default" color="red">
            {theme}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        {showRemoveButton ? (
          <button onClick={onRemove} className="cursor-pointer">
            <CancelIcon className="h-3 w-3 text-black" />
          </button>
        ) : (
          <div className="h-3 w-3" />
        )}
        {/* 좋아요 수 */}
        <div className="text-caption5 mt-6 ml-5 flex items-center justify-center gap-[3px]">
          <HeartFillIcon className="h-3 w-3" />
          <span className="w-[3ch] leading-none whitespace-nowrap tabular-nums">
            {likeCount > 99 ? '99+' : likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}
