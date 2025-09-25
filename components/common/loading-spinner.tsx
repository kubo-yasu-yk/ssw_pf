'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  label?: string;
  fullHeight?: boolean;
  className?: string;
}

export const LoadingSpinner = ({ label = '読み込み中です…', fullHeight = false, className }: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground',
        fullHeight && 'min-h-[200px]',
        className,
      )}
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span>{label}</span>
    </div>
  );
};
