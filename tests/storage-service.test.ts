import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage';
import { StorageService } from '@/lib/storage-service';
import type { StorageRecord } from '@/types';
import { MemoryStorage } from './utils/memory-storage';

describe('StorageService', () => {
  const createService = () => new StorageService(new MemoryStorage());

  it('保存したデータを取得できる', () => {
    const service = createService();
    const record: StorageRecord<string[]> = {
      version: STORAGE_VERSION,
      data: ['foo', 'bar'],
      updatedAt: new Date().toISOString(),
    };

    service.set(STORAGE_KEYS.jobs, record);
    expect(service.get<string[]>(STORAGE_KEYS.jobs)).toEqual(record);
  });

  it('データを削除できる', () => {
    const service = createService();
    const record: StorageRecord<number[]> = {
      version: STORAGE_VERSION,
      data: [1, 2, 3],
      updatedAt: new Date().toISOString(),
    };

    service.set(STORAGE_KEYS.jobs, record);
    service.remove(STORAGE_KEYS.jobs);

    expect(service.get<number[]>(STORAGE_KEYS.jobs)).toBeNull();
  });

  it('全削除が成功する', () => {
    const service = createService();
    const record: StorageRecord<string> = {
      version: STORAGE_VERSION,
      data: 'sample',
      updatedAt: new Date().toISOString(),
    };

    service.set(STORAGE_KEYS.jobs, record);
    service.set(STORAGE_KEYS.applications, record);
    service.clear();

    expect(service.get<string>(STORAGE_KEYS.jobs)).toBeNull();
    expect(service.get<string>(STORAGE_KEYS.applications)).toBeNull();
  });
});
