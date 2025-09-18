import { Button } from '@/component';
import { type Pair, type Place } from './types';

type Props = {
  region: Pair;
  activity: Pair;
  results: Place[];
  error: string | null;
  onReset: () => void;
};

export default function ResultsStep({ region, activity, results, error, onReset }: Props) {
  return (
    <>
      <h2 className="text-green1 mb-3 text-base font-semibold">탐색 결과</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {region.left && (
          <span className="bg-green3-light text-green1 border-green3 rounded-full border px-3 py-1 text-sm">
            지역: {region.left}
            {region.right ? ` ${region.right}` : ''}
          </span>
        )}
        {activity.left && activity.right && (
          <span className="bg-pink text-green1 border-red2 rounded-full border px-3 py-1 text-sm">
            테마: {activity.left} / {activity.right}
          </span>
        )}
        <Button
          onClick={onReset}
          className="ml-auto rounded-full px-3 py-1 text-sm"
          variant="md"
          color="green-muted"
        >
          다시 선택하기
        </Button>
      </div>

      {error && (
        <div className="border-red2 bg-red2 mb-4 rounded-lg border px-3 py-2 text-sm text-white">
          {error}
        </div>
      )}
      {!error && results.length === 0 && (
        <div className="text-gray1 py-16 text-center">
          조건에 맞는 여행지가 없어요. 필터를 바꿔보세요.
        </div>
      )}

      <ul className="grid grid-cols-1 gap-4">
        {results.map((p) => (
          <li
            key={String(p.id ?? p.name)}
            className="border-gray1 overflow-hidden rounded-2xl border shadow-sm"
          >
            <div className="bg-gray2 h-40 w-full">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-gray1 flex h-full w-full items-center justify-center">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-green1 font-semibold">{p.name}</div>
              <div className="text-green-muted mt-1 text-sm">
                {(p.sido || p.sigungu) && `${p.sido ?? ''} ${p.sigungu ?? ''}`}
              </div>
              {p.tags && p.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-blue btn-text-white rounded-full px-2 py-0.5 text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
