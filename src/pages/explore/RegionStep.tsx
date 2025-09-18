import RegionSelectorRaw from '@/component/selector/RegionSelector';
import { Button } from '@/component';
import { type Pair, toPair } from './types';

type Props = {
  value: Pair;
  onChange: (v: Pair) => void;
  onNext: () => void;
};

export default function RegionStep({ value, onChange, onNext }: Props) {
  return (
    <>
      <h2 className="text-green1 mb-4 text-base font-semibold">1단계: 지역을 골라주세요.</h2>
      <div className="rounded-2xl bg-white">
        <RegionSelectorRaw
          {...({
            onSelect: (v: any) => onChange(toPair(v)),
            value,
          } as any)}
        />
      </div>
      <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
        <Button variant="lg" color="green3" className="w-full" onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}
