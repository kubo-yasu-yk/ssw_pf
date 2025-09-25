'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { ErrorMessage } from '@/components/common/error-message';
import { JobList } from '@/components/jobs/job-list';
import { RequireClientAuth } from '@/components/auth/require-client-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useJobs } from '@/hooks/use-jobs';

const filterTabs = [
  { key: 'all', label: 'すべて' },
  { key: 'published', label: '公開中' },
  { key: 'draft', label: '下書き' },
] as const;

type FilterKey = (typeof filterTabs)[number]['key'];

const ClientJobListPage = () => {
  const { jobs, filters, setFilters, isLoading, togglePublish, error, reload } = useJobs({
    initialFilters: { isPublished: undefined },
  });

  const activeFilter: FilterKey = filters.isPublished === undefined ? 'all' : filters.isPublished ? 'published' : 'draft';

  const handleFilterChange = useCallback(
    (key: FilterKey) => {
      if (key === 'all') {
        setFilters({ ...filters, isPublished: undefined });
      } else if (key === 'published') {
        setFilters({ ...filters, isPublished: true });
      } else {
        setFilters({ ...filters, isPublished: false });
      }
    },
    [filters, setFilters],
  );

  return (
    <RequireClientAuth>
      <div className="container space-y-10 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">求人管理</h1>
            <p className="text-sm text-muted-foreground">
              求人の公開状態を切り替えたり、内容を編集したりできます。
            </p>
          </div>
          <Link href="/client/jobs/new">
            <Button>求人を新規作成</Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <ErrorMessage description={error} onRetry={reload} />
        ) : (
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            showManageActions
            onTogglePublish={(job) => togglePublish(job)}
          />
        )}
      </div>
    </RequireClientAuth>
  );
};

export default ClientJobListPage;
