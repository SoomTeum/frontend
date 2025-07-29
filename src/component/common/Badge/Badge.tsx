import { cn } from '@/utils/cn';
import { InfoIcon } from '@/assets';
import {
  BADGE_BASE,
  BADGE_COLOR,
  COUNT_COLOR,
  BADGE_COUNT,
  BADGE_SIZE
} from './Badge.styled';
import type { BadgeProp } from './Badge.types';

export default function Badge({ type, children, color, count, percent, size='sm' }: BadgeProp) {
  const appliedColor = color ?? 'green';
  const appliedSize=size??'sm';

  const getStatusColor = (rate: number) => {
    if (rate === 0) return 'red';
    if (rate <= 10) return 'orange';
    if (rate <= 40) return 'yellow';
    return 'green';
  };

  const content = (
    <>
      {children}
      {type === 'default' && count !== undefined && (
        <span className={cn(BADGE_COUNT, COUNT_COLOR.green, "ml-1")}>
          {count}
        </span>
      )}
      {type === 'parkingTag' && (
        <InfoIcon className="ml-1 w-3 h-3"/>
      )}
    </>
  );

  const colorClass =
    type === 'parkingTag'
      ? BADGE_COLOR.beige
      : type === 'parkingCount'
      ? BADGE_COLOR[getStatusColor(percent ?? 0)]
      : BADGE_COLOR[appliedColor];
  
  const radiusClass = type === 'default' ? 'rounded-l' : 'rounded-[10px]';

  return <span className={cn(BADGE_BASE, BADGE_SIZE[appliedSize], colorClass, radiusClass)}>{content}</span>;
}
