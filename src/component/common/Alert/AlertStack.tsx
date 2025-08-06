import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type AlertStackProps = {
  children: ReactNode;
  className?: string; //외부에서 위치 조정...
};

export default function AlertStack({ children, className }: AlertStackProps) {
  return <div className={cn('flex flex-col-reverse gap-3', className)}>{children}</div>;
}
