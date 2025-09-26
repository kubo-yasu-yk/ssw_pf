'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface LayoutShellProps {
  children: ReactNode;
}

export const LayoutShell = ({ children }: LayoutShellProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/client/login';

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {!isLoginPage && <Header />}
      <main className="flex-1 bg-muted/20">{children}</main>
      {!isLoginPage && <Footer />}
    </div>
  );
};
