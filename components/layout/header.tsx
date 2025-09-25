'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useClientAuth } from '@/hooks/use-client-auth';

const navLinks = [
  { href: '/jobs', label: '求人を探す' },
  { href: '/privacy', label: 'プライバシー' },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useClientAuth();

  const displayLinks = isAuthenticated ? navLinks.filter((link) => link.href !== '/jobs') : navLinks;

  const renderLinkClass = (href: string) =>
    cn(
      'px-3 py-2 text-sm font-medium transition-colors',
      pathname?.startsWith(href)
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href={isAuthenticated ? '/client' : '/'} className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">SW</span>
          <span>Skilled Worker Platform</span>
        </Link>
        <nav className="hidden flex-1 items-center justify-start gap-6 pl-8 md:flex">
          {displayLinks.map((link) => (
            <Link key={link.href} href={link.href} className={renderLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/client">
                <Button variant="secondary" size="sm">
                  企業ダッシュボード
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.replace('/client/login');
                }}
              >
                ログアウト
              </Button>
            </>
          ) : (
            <Link href="/client/login">
              <Button variant="default" size="sm">
                企業向けログイン
              </Button>
            </Link>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-muted md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="メニューを開閉"
        >
          <span className="h-5 w-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-2 py-3">
            {displayLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  pathname?.startsWith(link.href)
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/client" onClick={() => setOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      企業ダッシュボード
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      logout();
                      router.replace('/client/login');
                    }}
                  >
                    ログアウト
                  </Button>
                </>
              ) : (
                <Link href="/client/login" onClick={() => setOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    企業向けログイン
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
