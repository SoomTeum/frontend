import TravelActivitySelectorRaw from '@/component/selector/TravelActivitySelector';
import { Button } from '@/component';
import { type Pair, toPair } from './types';

type Props = {
  value: Pair;
  onChange: (v: Pair) => void;
  onPrev: () => void;
  onFinish: () => void;
};

export default function ThemeStep({ value, onChange, onPrev, onFinish }: Props) {
  return (
    <>
      <h2 className="text-green1 mb-4 text-base font-semibold">2단계: 테마를 골라주세요.</h2>
      <div className="rounded-2xl bg-white">
        <TravelActivitySelectorRaw
          {...({
            onSelect: (v: any) => onChange(toPair(v)),
            value,
          } as any)}
        />
      </div>
      <div className="fixed right-0 bottom-[10px] left-0 z-10 mx-auto w-full max-w-[430px] px-10 pt-4 pb-6">
        <div className="flex justify-between">
          <Button color="green-muted" variant="md" onClick={onPrev}>
            이전
          </Button>
          <Button color="green3" variant="md" onClick={onFinish}>
            완료
          </Button>
        </div>
      </div>
    </>
  );
}
