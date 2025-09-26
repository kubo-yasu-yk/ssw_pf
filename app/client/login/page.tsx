'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientAuth } from '@/hooks/use-client-auth';

const ClientLoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useClientAuth();
  const [email, setEmail] = useState('company@example.com');
  const [password, setPassword] = useState('dummy-password');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/client');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsSubmitting(true);
    login();
    router.replace('/client');
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Client Portal</p>
          <h1 className="text-2xl font-semibold text-foreground">企業向けログイン</h1>
          <p className="text-sm text-muted-foreground">
            ダミーアカウントでログインし、企業向けダッシュボードの機能をご確認いただけます。
            <br />
            <span className="text-xs text-muted-foreground">
              ※ フォームには既にダミー値が入力されています
            </span>
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="client-email">
              メールアドレス
            </label>
            <Input
              id="client-email"
              type="email"
              autoComplete="email"
              placeholder="company@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="client-password">
              パスワード
            </label>
            <Input
              id="client-password"
              type="password"
              autoComplete="current-password"
              placeholder="dummy-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            ログイン
          </Button>
        </form>
        <div className="space-y-3 text-center">
          <p className="text-xs text-muted-foreground">
            ログイン後は{' '}
            <Link href="/client" className="text-primary hover:text-primary/80">
              企業ダッシュボード
            </Link>{' '}
            へ自動的に遷移します。
          </p>
          <div className="border-t border-border pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;
