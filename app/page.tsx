import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { initialJobs } from '@/data/initial-jobs';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
              特定技能の方向け求人サイト
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              あなたの技能を活かせる仕事が見つかります
            </h1>
            <p className="text-lg text-muted-foreground">
              業種・地域・日本語レベルで仕事を探し、条件を確認したらそのまま応募できます。
              企業側も応募状況をブラウザだけで確認できます。
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  求人を見る
                </Button>
              </Link>
              <Link href="/client/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  企業向けログイン
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">直近の人気求人</p>
                <span className="text-xs text-muted-foreground">リアルタイム更新</span>
              </div>
              <div className="space-y-3">
                {initialJobs.slice(0, 3).map((job) => {
                  const href = `/jobs/${job.id}` as Route;

                  return (
                    <div
                      key={job.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-muted/40 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {job.title} ｜ {job.location.prefecture}
                          {job.location.city}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          応募受付中。条件は詳細ページで確認できます。
                        </p>
                      </div>
                      <Link href={href} className="text-xs font-medium text-primary hover:text-primary/80">
                        詳しく見る
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
