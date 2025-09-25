import { STORAGE_KEYS } from '@/constants/storage';
import { JobService, type JobInput } from '@/lib/job-service';
import { StorageService } from '@/lib/storage-service';
import type { Job } from '@/types';
import { MemoryStorage } from './utils/memory-storage';

describe('JobService', () => {
  const createService = () => new JobService(new StorageService(new MemoryStorage()));

  it('初期データを取得できる', () => {
    const service = createService();
    const jobs = service.list();
    expect(jobs.length).toBeGreaterThan(0);
  });

  it('求人を作成し保存できる', () => {
    const service = createService();
    const before = service.list().length;

    const input: JobInput = {
      title: 'テスト求人',
      industry: '製造',
      category: '組立',
      description: 'テスト用の求人概要',
      responsibilities: ['工程管理'],
      requirements: ['経験1年以上'],
      jlptLevel: 'N3',
      location: { prefecture: '東京都', city: '新宿区' },
      salary: { min: 200000, max: 250000, currency: 'JPY', period: 'monthly' },
      benefits: ['交通費支給'],
      employmentType: 'full-time',
      isPublished: true,
      tags: ['テスト'],
      company: {
        name: 'テスト株式会社',
        description: 'テスト企業',
        contactEmail: 'test@example.com',
      },
    };

    const job = service.create(input);
    expect(job.id).toContain('job-');

    const after = service.list().length;
    expect(after).toBe(before + 1);
  });

  it('公開状態を切り替えられる', () => {
    const service = createService();
    const job = service.list()[0];

    const toggled = service.togglePublish(job.id);
    expect(toggled.isPublished).toBe(!job.isPublished);

    const restored = service.togglePublish(job.id);
    expect(restored.isPublished).toBe(job.isPublished);
  });
});
