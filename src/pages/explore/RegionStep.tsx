import { useCallback, useRef } from 'react';
import RegionSelectorRaw from '@/component/selector/RegionSelector';
import { Button } from '@/component';
import type { Pair } from './types';

type RegionSelectPayload = {
  region: string;
  sigungu?: string;
  areaCode: string | number;
  sigunguCode?: string | number;
};

type Props = {
  value: Pair;
  onChange: (v: Pair) => void;
  onChangeCodes?: (codes: { areaCode?: string | number; sigunguCode?: string | number }) => void;
  onNext: () => void;
};

export default function RegionStep({ value, onChange, onChangeCodes, onNext }: Props) {
  const lastKeyRef = useRef('');
  const canNext = Boolean(value.right);
  const handleSelect = useCallback(
    (p: RegionSelectPayload) => {
      const left = p.region;
      const right = p.sigungu;
      const key = `${left}|${right ?? ''}`;

      if (key === lastKeyRef.current) return;
      lastKeyRef.current = key;

      if (value.left !== left || value.right !== right) {
        onChange({ left, right });
      }
      onChangeCodes?.({ areaCode: p.areaCode, sigunguCode: p.sigunguCode });
    },
    [onChange, onChangeCodes, value.left, value.right],
  );

  return (
    <>
      <h2 className="text-green1 mb-4 text-base font-semibold">1단계: 지역을 골라주세요.</h2>
      <div className="rounded-2xl bg-white">
        <RegionSelectorRaw onChange={handleSelect} />
      </div>
      <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
        <Button variant="lg" color="green3" className="w-full" onClick={onNext} disabled={!canNext}>
          다음
        </Button>
      </div>
    </>
  );
}
