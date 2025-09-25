import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-foreground">&copy; {new Date().getFullYear()} Skilled Worker Platform</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:text-primary">
            プライバシーポリシー
          </Link>
          <Link href="/client/login" className="hover:text-primary">
            企業向けログイン
          </Link>
          <Link href="/jobs" className="hover:text-primary">
            求人一覧
          </Link>
        </div>
      </div>
    </footer>
  );
};
