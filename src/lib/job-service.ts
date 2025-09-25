import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage';
import { initialJobs } from '@/data/initial-jobs';
import { createPlatformError } from '@/lib/errors';
import { generateId } from '@/lib/id';
import { storageService, StorageService } from '@/lib/storage-service';
import type { Job, JobFilter, StorageRecord } from '@/types';

const JLPT_ORDER: Record<string, number> = {
  未取得: 0,
  N5: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

const normalizeJobs = (jobs: Job[]): Job[] => {
  return jobs
    .map((job) => ({
      ...job,
      createdAt: job.createdAt ?? job.updatedAt ?? new Date().toISOString(),
      updatedAt: job.updatedAt ?? job.createdAt ?? new Date().toISOString(),
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

const mergeJobs = (storedJobs: Job[]): Job[] => {
  const jobMap = new Map<string, Job>();

  normalizeJobs(initialJobs).forEach((job) => {
    jobMap.set(job.id, job);
  });

  normalizeJobs(storedJobs).forEach((job) => {
    jobMap.set(job.id, job);
  });

  return normalizeJobs(Array.from(jobMap.values()));
};

const filterJobs = (jobs: Job[], filter?: JobFilter): Job[] => {
  if (!filter) {
    return jobs;
  }

  const keyword = filter.keyword?.toLowerCase().trim();

  return jobs.filter((job) => {
    if (filter.isPublished !== undefined && job.isPublished !== filter.isPublished) {
      return false;
    }

    if (filter.prefecture && job.location.prefecture !== filter.prefecture) {
      return false;
    }

    if (filter.jlptLevel && job.jlptLevel !== filter.jlptLevel) {
      if (
        JLPT_ORDER[job.jlptLevel] === undefined ||
        JLPT_ORDER[filter.jlptLevel] === undefined ||
        JLPT_ORDER[job.jlptLevel] > JLPT_ORDER[filter.jlptLevel]
      ) {
        return false;
      }
    }

    if (filter.industry && job.industry !== filter.industry) {
      return false;
    }

    if (filter.employmentType && job.employmentType !== filter.employmentType) {
      return false;
    }

    if (keyword) {
      const haystack = [
        job.title,
        job.description,
        job.company.name,
        job.industry,
        job.category,
        job.tags.join(' '),
        `${job.location.prefecture}${job.location.city}`,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
};

export type JobInput = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;

export class JobService {
  constructor(private readonly storage: StorageService = storageService) {}

  private readRecord(): StorageRecord<Job[]> {
    const stored = this.storage.get<Job[]>(STORAGE_KEYS.jobs);

    if (stored && stored.version === STORAGE_VERSION) {
      return stored;
    }

    const merged = mergeJobs(stored?.data ?? []);
    const record: StorageRecord<Job[]> = {
      version: STORAGE_VERSION,
      data: merged,
      updatedAt: new Date().toISOString(),
    };

    if (this.storage.isAvailable) {
      try {
        this.storage.set(STORAGE_KEYS.jobs, record);
      } catch (error) {
        console.error(error);
      }
    }

    return record;
  }

  private writeRecord(jobs: Job[]): void {
    const record: StorageRecord<Job[]> = {
      version: STORAGE_VERSION,
      data: normalizeJobs(jobs),
      updatedAt: new Date().toISOString(),
    };

    try {
      this.storage.set(STORAGE_KEYS.jobs, record);
    } catch (error) {
      throw createPlatformError('JOB_SAVE_FAILED', '求人データの保存に失敗しました。', undefined, error);
    }
  }

  list(filter?: JobFilter): Job[] {
    const record = this.readRecord();
    return filterJobs(record.data, filter);
  }

  findById(id: string): Job | null {
    const record = this.readRecord();
    return record.data.find((job) => job.id === id) ?? null;
  }

  create(input: JobInput): Job {
    const timestamp = new Date().toISOString();
    const job: Job = {
      ...input,
      id: generateId('job'),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const record = this.readRecord();
    this.writeRecord([job, ...record.data]);

    return job;
  }

  update(id: string, updates: Partial<JobInput>): Job {
    const record = this.readRecord();
    const index = record.data.findIndex((job) => job.id === id);

    if (index === -1) {
      throw createPlatformError('JOB_NOT_FOUND', '指定された求人が見つかりません。');
    }

    const updatedJob: Job = {
      ...record.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const nextJobs = [...record.data];
    nextJobs[index] = updatedJob;

    this.writeRecord(nextJobs);

    return updatedJob;
  }

  togglePublish(id: string): Job {
    const job = this.findById(id);
    if (!job) {
      throw createPlatformError('JOB_NOT_FOUND', '指定された求人が見つかりません。');
    }

    return this.update(id, { isPublished: !job.isPublished });
  }

  industries(): string[] {
    const record = this.readRecord();
    return Array.from(new Set(record.data.map((job) => job.industry))).sort();
  }

  prefectures(): string[] {
    const record = this.readRecord();
    return Array.from(new Set(record.data.map((job) => job.location.prefecture))).sort();
  }

  jlptLevels(): string[] {
    return ['N1', 'N2', 'N3', 'N4', 'N5', '未取得'];
  }
}

export const jobService = new JobService();
