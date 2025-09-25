'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { jobService, type JobInput } from '@/lib/job-service';
import type { Job, JobFilter } from '@/types';

interface UseJobsOptions {
  initialFilters?: JobFilter;
}

export const useJobs = ({ initialFilters }: UseJobsOptions = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilter>({ isPublished: true, ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [industryOptions, setIndustryOptions] = useState<string[]>(() => jobService.industries());
  const [prefectureOptions, setPrefectureOptions] = useState<string[]>(() => jobService.prefectures());

  const loadJobs = useCallback(() => {
    try {
      setIsLoading(true);
      const list = jobService.list(filters);
      setJobs(list);
      setIndustryOptions(jobService.industries());
      setPrefectureOptions(jobService.prefectures());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('求人情報の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    loadJobs();
  }, [loadJobs]);

  const createJob = useCallback(
    (input: JobInput) => {
      try {
        const job = jobService.create(input);
        setJobs((prev) => [job, ...prev]);
        setIndustryOptions(jobService.industries());
        setPrefectureOptions(jobService.prefectures());
        return job;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [],
  );

  const updateJob = useCallback((id: string, updates: Partial<JobInput>) => {
    const job = jobService.update(id, updates);
    setJobs((prev) => prev.map((item) => (item.id === id ? job : item)));
    setIndustryOptions(jobService.industries());
    setPrefectureOptions(jobService.prefectures());
    return job;
  }, []);

  const togglePublish = useCallback((job: Job) => {
    const updated = jobService.togglePublish(job.id);
    setJobs((prev) => prev.map((item) => (item.id === job.id ? updated : item)));
    setIndustryOptions(jobService.industries());
    setPrefectureOptions(jobService.prefectures());
    return updated;
  }, []);

  const industries = useMemo(() => industryOptions, [industryOptions]);
  const prefectures = useMemo(() => prefectureOptions, [prefectureOptions]);
  const jlptLevels = useMemo(() => jobService.jlptLevels(), []);

  return {
    jobs,
    filters,
    setFilters,
    isLoading,
    error,
    reload: loadJobs,
    createJob,
    updateJob,
    togglePublish,
    industries,
    prefectures,
    jlptLevels,
  };
};
