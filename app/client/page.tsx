'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useMemo } from 'react';
import { RequireClientAuth } from '@/components/auth/require-client-auth';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/use-applications';
import { useJobs } from '@/hooks/use-jobs';

const ClientDashboardPage = () => {
  const { jobs } = useJobs({ initialFilters: { isPublished: undefined } });
  const { applications } = useApplications();

  const stats = useMemo(() => {
    const published = jobs.filter((job) => job.isPublished).length;
    const draft = jobs.length - published;
    const totalApplicants = applications.length;

    const byStatus = applications.reduce<Record<string, number>>((acc, application) => {
      acc[application.status] = (acc[application.status] ?? 0) + 1;
      return acc;
    }, {});

    return { published, draft, totalApplicants, byStatus };
  }, [jobs, applications]);

  const cards: { title: string; description: string; href: Route; action: string }[] = [
    {
      title: '求人一覧',
      description: '公開中・下書きの求人を確認し、公開状態を切り替えます。',
      href: '/client/jobs',
      action: '求人管理へ',
    },
    {
      title: '応募者管理',
      description: '応募者のステータス更新や連絡先の確認を行います。',
      href: '/client/applicants',
      action: '応募者管理へ',
    },
    {
      title: '新規求人作成',
      description: 'フォームから求人情報を登録し、すぐに公開できます。',
      href: '/client/jobs/new',
      action: '求人を作成',
    },
  ];

  return (
    <RequireClientAuth>
      <div className="container space-y-12 py-12">
        <section className="rounded-xl border border-border bg-card p-10 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">企業ダッシュボード</p>
              <h1 className="text-3xl font-bold text-foreground">求人と応募をまとめて管理</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                求人の公開・停止、応募状況の確認、応募者のステータス更新をこのダッシュボードから行えます。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/client/jobs/new">
                <Button>新しい求人を作成</Button>
              </Link>
              <Link href="/client/applicants">
                <Button variant="outline">応募者一覧を見る</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">公開中の求人</p>
            <p className="mt-3 text-4xl font-bold text-foreground">{stats.published}</p>
            <p className="text-xs text-muted-foreground">下書き: {stats.draft} 件</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">累計応募数</p>
            <p className="mt-3 text-4xl font-bold text-foreground">{stats.totalApplicants}</p>
            <p className="text-xs text-muted-foreground">応募はリアルタイムで更新されます</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">ステータス別</p>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {['new', 'screening', 'interview', 'offer', 'rejected'].map((status) => (
                <li key={status} className="flex items-center justify-between">
                  <span>
                    {status === 'new'
                      ? '新規'
                    : status === 'screening'
                      ? '書類選考'
                      : status === 'interview'
                        ? '面接'
                        : status === 'offer'
                          ? '内定'
                          : '不採用'}
                </span>
                <span className="font-semibold text-foreground">{stats.byStatus[status] ?? 0}</span>
              </li>
            ))}
          </ul>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
          <article key={card.href} className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
            <Link
              href={card.href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
            >
              {card.action}
            </Link>
          </article>
        ))}
        </section>
      </div>
    </RequireClientAuth>
  );
};

export default ClientDashboardPage;
