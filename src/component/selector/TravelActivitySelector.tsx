import SelectorMulti from './SelectorMulti';
import { activityMap } from '@/constants/ActivityMap';
import { cn } from '@/utils/cn';

type Props = {
  className?: string;
  onChange?: (main: string, subs: string[]) => void;
};

export default function TravelActivitySelector({ className, onChange }: Props) {
  return (
    <div className={cn('w-full', className)}>
      <SelectorMulti
        dataMap={activityMap}
        initialMain="자연"
        colorScheme={{
          leftBase: 'bg-red2 text-black text-caption4',
          leftItem: 'text-black text-caption4',
          leftActive: 'bg-pink text-black text-caption4',
          rightItem: 'text-black',
          rightActive: 'bg-red2 text-black text-caption4',
          borderColor: 'border-red2',
        }}
        onSelect={(main, subs) => {
          console.log('선택된:', main, subs);
          onChange?.(main, subs);
        }}
      />
    </div>
  );
}
