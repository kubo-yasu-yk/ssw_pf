'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useClientAuth } from '@/hooks/use-client-auth';

interface RequireClientAuthProps {
  children: ReactNode;
}

export const RequireClientAuth = ({ children }: RequireClientAuthProps) => {
  const { isAuthenticated, isLoading } = useClientAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/client/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container py-16">
        <LoadingSpinner label="企業向けダッシュボードを読み込み中です…" fullHeight />
      </div>
    );
  }

  return <>{children}</>;
};
