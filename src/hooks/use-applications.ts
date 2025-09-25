'use client';

import { useCallback, useEffect, useState } from 'react';
import { applicationService, type ApplicationInput } from '@/lib/application-service';
import type { Application, ApplicationStatus } from '@/types';

interface UseApplicationsOptions {
  jobId?: string;
}

export const useApplications = ({ jobId }: UseApplicationsOptions = {}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      setIsLoading(true);
      const list = applicationService.list(jobId);
      setApplications(list);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('応募者情報の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    load();
  }, [load]);

  const create = useCallback((input: ApplicationInput) => {
    const application = applicationService.create(input);
    setApplications((prev) => [application, ...prev]);
    return application;
  }, []);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    const application = applicationService.updateStatus(id, status);
    setApplications((prev) => prev.map((item) => (item.id === id ? application : item)));
    return application;
  }, []);

  return {
    applications,
    isLoading,
    error,
    reload: load,
    create,
    updateStatus,
  };
};
