'use client';

import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export const ErrorMessage = ({
  title = 'エラーが発生しました',
  description = 'ページを再読み込みしてください。',
  actionLabel = '再試行',
  onRetry,
  children,
}: ErrorMessageProps) => {
  return (
    <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 text-sm text-destructive/80">{description}</p>
      </div>
      {children}
      {onRetry && (
        <Button variant="destructive" onClick={onRetry}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
