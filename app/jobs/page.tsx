'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorMessage } from '@/components/common/error-message';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobList } from '@/components/jobs/job-list';
import { useJobs } from '@/hooks/use-jobs';
import type { JobFilter, JLPTLevel } from '@/types';

const parseFiltersFromSearchParams = (searchParams: URLSearchParams): JobFilter => {
  const jlpt = searchParams.get('jlptLevel');
  const employmentType = searchParams.get('employmentType');

  return {
    keyword: searchParams.get('keyword') ?? undefined,
    prefecture: searchParams.get('prefecture') ?? undefined,
    industry: searchParams.get('industry') ?? undefined,
    jlptLevel: (jlpt as JLPTLevel) || undefined,
    employmentType: (employmentType as JobFilter['employmentType']) || undefined,
    isPublished: true,
  };
};

const buildSearchParams = (filters: JobFilter) => {
  const params = new URLSearchParams();
  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.prefecture) params.set('prefecture', filters.prefecture);
  if (filters.industry) params.set('industry', filters.industry);
  if (filters.jlptLevel) params.set('jlptLevel', filters.jlptLevel);
  if (filters.employmentType) params.set('employmentType', filters.employmentType);
  return params.toString();
};

const JobsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);

  const {
    jobs,
    filters,
    setFilters,
    isLoading,
    error,
    industries,
    prefectures,
    jlptLevels,
    reload,
  } = useJobs({
    initialFilters,
  });

  const handleFilterChange = useCallback(
    (nextFilters: JobFilter) => {
      setFilters(nextFilters);
      const query = buildSearchParams(nextFilters);
      router.replace(query ? `/jobs?${query}` : '/jobs', { scroll: false });
    },
    [router, setFilters],
  );

  return (
    <div className="space-y-10 py-12">
      <section className="container space-y-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          募集中の求人
        </span>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          特定技能の方向け 求人一覧
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          業種、働く場所、JLPTレベルなどの条件で求人を絞り込めます。オンライン応募も可能です。
        </p>
      </section>

      <section className="container space-y-10">
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          industries={industries}
          prefectures={prefectures}
          jlptLevels={jlptLevels as JLPTLevel[]}
        />

        {error ? (
          <ErrorMessage description={error} onRetry={reload} />
        ) : (
          <JobList jobs={jobs} isLoading={isLoading} />
        )}
      </section>
    </div>
  );
};

export default JobsPage;
