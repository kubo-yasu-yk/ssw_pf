'use client';

import { useState } from 'react';
import { ApplicationList } from '@/components/applications/application-list';
import { RequireClientAuth } from '@/components/auth/require-client-auth';
import { ErrorMessage } from '@/components/common/error-message';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Select } from '@/components/ui/select';
import { useApplications } from '@/hooks/use-applications';
import { useJobs } from '@/hooks/use-jobs';
import type { ApplicationStatus } from '@/types';

const ClientApplicantsPage = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const { jobs } = useJobs({ initialFilters: { isPublished: undefined } });
  const { applications, isLoading, error, updateStatus } = useApplications({ jobId: selectedJobId });

  const handleStatusChange = (applicationId: string, status: ApplicationStatus) => {
    updateStatus(applicationId, status);
  };

  return (
    <RequireClientAuth>
      <div className="container space-y-8 py-12">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">応募者管理</h1>
          <p className="text-sm text-muted-foreground">
            求人ごとの応募者を把握し、選考ステータスを更新しましょう。
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <label className="space-y-2 text-sm text-muted-foreground md:w-1/3">
            求人で絞り込む
            <Select
              value={selectedJobId ?? ''}
              onChange={(event) => setSelectedJobId(event.target.value || undefined)}
            >
              <option value="">すべての求人</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </Select>
          </label>
          <p className="text-xs text-muted-foreground">
            現在の応募数: <span className="font-semibold text-foreground">{applications.length}</span> 件
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner fullHeight />
        ) : error ? (
          <ErrorMessage description={error} onRetry={() => setSelectedJobId(undefined)} />
        ) : (
          <ApplicationList applications={applications} jobs={jobs} onStatusChange={handleStatusChange} />
        )}
      </div>
    </RequireClientAuth>
  );
};

export default ClientApplicantsPage;
