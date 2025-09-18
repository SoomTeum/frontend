import { useCallback, useRef } from 'react';
import TravelActivitySelectorRaw from '@/component/selector/TravelActivitySelector';
import { Button } from '@/component';
import type { Pair } from './types';

type Props = {
  value: Pair;
  onChange: (v: Pair) => void;
  onChangeCodes?: (v: { cat1?: string; cat2?: string[] }) => void;
  onPrev: () => void;
  onFinish: () => void;
  canFinish?: boolean;
};

export default function ThemeStep({
  canFinish,
  value,
  onChange,
  onChangeCodes,
  onPrev,
  onFinish,
}: Props) {
  const lastNameKey = useRef<string>('');
  const lastCodeKey = useRef<string>('');
  const enabled = typeof canFinish === 'boolean' ? canFinish : Boolean(value.left && value.right);
  const handleNames = useCallback(
    (main: string, subs: string[]) => {
      const left = main;
      const right = subs?.[0];
      const nextKey = `${left}|${right ?? ''}`;

      if (nextKey === lastNameKey.current) return;
      if (value.left === left && value.right === right) {
        lastNameKey.current = nextKey;
        return;
      }

      lastNameKey.current = nextKey;
      onChange({ left, right });
    },
    [onChange, value.left, value.right],
  );

  const handleCodes = useCallback(
    (cat1?: string, cat2?: string[]) => {
      const key = `${cat1 ?? ''}|${(cat2 ?? []).join(',')}`;
      if (key === lastCodeKey.current) return;

      lastCodeKey.current = key;
      onChangeCodes?.({ cat1, cat2 });
    },
    [onChangeCodes],
  );

  return (
    <>
      <h2 className="text-green1 mb-4 text-base font-semibold">2단계: 테마를 골라주세요.</h2>
      <div className="rounded-2xl bg-white">
        <TravelActivitySelectorRaw onChange={handleNames} onChangeCodes={handleCodes} />
      </div>
      <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
        <div className="flex justify-between">
          <Button color="green-muted" variant="md" onClick={onPrev}>
            이전
          </Button>
          <Button color="green3" variant="md" onClick={onFinish} disabled={!enabled}>
            완료
          </Button>
        </div>
      </div>
    </>
  );
}
