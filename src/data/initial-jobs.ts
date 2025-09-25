import type { Job } from '@/types';
import jobs from '@/../public/mock/jobs.json';

export const initialJobs: Job[] = (jobs as Job[]).map((job) => ({
  ...job,
  createdAt: job.createdAt ?? new Date().toISOString(),
  updatedAt: job.updatedAt ?? job.createdAt ?? new Date().toISOString(),
}));
