import { STORAGE_KEYS, type StorageKey } from '@/constants/storage';
import { createPlatformError } from '@/lib/errors';
import type { StorageRecord } from '@/types';

const getBrowserStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { localStorage } = window;
    const testKey = '__skjp_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return localStorage;
  } catch (error) {
    console.error('LocalStorageの初期化に失敗しました', error);
    return null;
  }
};

export class StorageService {
  private readonly storage: Storage | null;

  constructor(storage?: Storage | null) {
    this.storage = storage ?? getBrowserStorage();
  }

  static get default(): StorageService {
    return new StorageService();
  }

  get isAvailable(): boolean {
    return this.storage !== null;
  }

  get<T>(key: StorageKey): StorageRecord<T> | null {
    if (!this.storage) {
      return null;
    }

    try {
      const raw = this.storage.getItem(key);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as StorageRecord<T>;
    } catch (error) {
      console.error(
        createPlatformError('STORAGE_READ_ERROR', 'LocalStorageからの読み込みに失敗しました。', undefined, error),
      );
      return null;
    }
  }

  set<T>(key: StorageKey, record: StorageRecord<T>): void {
    if (!this.storage) {
      throw createPlatformError('STORAGE_UNAVAILABLE', 'LocalStorageが利用できません。');
    }

    try {
      this.storage.setItem(key, JSON.stringify(record));
    } catch (error) {
      throw createPlatformError('STORAGE_WRITE_ERROR', 'LocalStorageへの保存に失敗しました。', undefined, error);
    }
  }

  remove(key: StorageKey): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(
        createPlatformError('STORAGE_REMOVE_ERROR', 'LocalStorageからの削除に失敗しました。', undefined, error),
      );
    }
  }

  clear(): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.clear();
    } catch (error) {
      console.error(
        createPlatformError('STORAGE_CLEAR_ERROR', 'LocalStorageのクリアに失敗しました。', undefined, error),
      );
    }
  }
}

export const storageService = StorageService.default;

export const resetPlatformStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
};
