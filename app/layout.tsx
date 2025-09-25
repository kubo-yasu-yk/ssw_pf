import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LayoutShell } from '@/components/layout/layout-shell';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Skilled Worker Job Platform',
    template: "%s | Skilled Worker Job Platform",
  },
  description:
    '特定技能人材向けの求人検索・応募と、企業向けの求人管理を支援するプラットフォーム。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
