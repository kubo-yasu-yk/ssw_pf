export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  jobs: 'skjp.jobs',
  applications: 'skjp.applications',
  settings: 'skjp.settings',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
