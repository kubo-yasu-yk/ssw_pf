import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface LayoutShellProps {
  children: ReactNode;
}

export const LayoutShell = ({ children }: LayoutShellProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">{children}</main>
      <Footer />
    </div>
  );
};
