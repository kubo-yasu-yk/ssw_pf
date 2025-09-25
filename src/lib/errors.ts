import type { PlatformError } from '@/types';

export const createPlatformError = (
  code: string,
  message: string,
  details?: string,
  cause?: unknown,
): PlatformError => ({
  code,
  message,
  details,
  cause,
});

export const isPlatformError = (value: unknown): value is PlatformError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value
  );
};
