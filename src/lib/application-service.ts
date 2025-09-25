import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage';
import { createPlatformError } from '@/lib/errors';
import { generateId } from '@/lib/id';
import { storageService, StorageService } from '@/lib/storage-service';
import type { Application, ApplicationStatus, ApplicantSummary, StorageRecord } from '@/types';

export type ApplicationInput = Omit<
  Application,
  'id' | 'status' | 'submittedAt' | 'updatedAt'
> & {
  status?: ApplicationStatus;
};

export class ApplicationService {
  constructor(private readonly storage: StorageService = storageService) {}

  private readRecord(): StorageRecord<Application[]> {
    const stored = this.storage.get<Application[]>(STORAGE_KEYS.applications);

    if (stored && stored.version === STORAGE_VERSION) {
      return stored;
    }

    const record: StorageRecord<Application[]> = {
      version: STORAGE_VERSION,
      data: stored?.data ?? [],
      updatedAt: new Date().toISOString(),
    };

    if (this.storage.isAvailable) {
      try {
        this.storage.set(STORAGE_KEYS.applications, record);
      } catch (error) {
        console.error(error);
      }
    }

    return record;
  }

  private writeRecord(applications: Application[]): void {
    const record: StorageRecord<Application[]> = {
      version: STORAGE_VERSION,
      data: applications,
      updatedAt: new Date().toISOString(),
    };

    try {
      this.storage.set(STORAGE_KEYS.applications, record);
    } catch (error) {
      throw createPlatformError('APPLICATION_SAVE_FAILED', '応募データの保存に失敗しました。', undefined, error);
    }
  }

  list(jobId?: string): Application[] {
    const record = this.readRecord();
    const apps = record.data;
    return jobId ? apps.filter((application) => application.jobId === jobId) : apps;
  }

  findById(id: string): Application | null {
    const record = this.readRecord();
    return record.data.find((application) => application.id === id) ?? null;
  }

  create(input: ApplicationInput): Application {
    const timestamp = new Date().toISOString();
    const application: Application = {
      ...input,
      id: generateId('app'),
      status: input.status ?? 'new',
      submittedAt: timestamp,
      updatedAt: timestamp,
    };

    const record = this.readRecord();
    this.writeRecord([application, ...record.data]);

    return application;
  }

  update(id: string, updates: Partial<ApplicationInput>): Application {
    const record = this.readRecord();
    const index = record.data.findIndex((application) => application.id === id);

    if (index === -1) {
      throw createPlatformError('APPLICATION_NOT_FOUND', '指定された応募が見つかりません。');
    }

    const updated: Application = {
      ...record.data[index],
      ...updates,
      status: updates.status ?? record.data[index].status,
      updatedAt: new Date().toISOString(),
    };

    const next = [...record.data];
    next[index] = updated;

    this.writeRecord(next);

    return updated;
  }

  updateStatus(id: string, status: ApplicationStatus): Application {
    return this.update(id, { status });
  }

  summaryByJob(jobId: string, jobTitle = ''): ApplicantSummary {
    const applications = this.list(jobId);

    const groupedByStatus = applications.reduce<ApplicantSummary['groupedByStatus']>(
      (acc, application) => {
        acc[application.status] = (acc[application.status] ?? 0) + 1;
        return acc;
      },
      {
        new: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      },
    );

    return {
      jobId,
      jobTitle,
      totalApplicants: applications.length,
      groupedByStatus,
    };
  }
}

export const applicationService = new ApplicationService();
