'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { Application, ApplicationStatus, Job } from '@/types';

interface ApplicationListProps {
  applications: Application[];
  jobs: Job[];
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
}

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: 'new', label: '新規' },
  { value: 'screening', label: '書類選考中' },
  { value: 'interview', label: '面接中' },
  { value: 'offer', label: '内定' },
  { value: 'rejected', label: '不採用' },
];

const statusColours: Record<ApplicationStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  screening: 'bg-amber-100 text-amber-700',
  interview: 'bg-violet-100 text-violet-700',
  offer: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export const ApplicationList = ({ applications, jobs, onStatusChange }: ApplicationListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const jobMap = new Map(jobs.map((job) => [job.id, job] as const));

  if (!applications.length) {
    return (
      <EmptyState
        title="応募者はまだいません"
        description="求人ページから応募が届くとここに表示されます。"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-6 py-4">応募者</th>
            <th className="px-6 py-4">応募求人</th>
            <th className="px-6 py-4">在留資格 / JLPT</th>
            <th className="px-6 py-4">ステータス</th>
            <th className="px-6 py-4 text-right">アクション</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {applications.map((application) => {
            const job = jobMap.get(application.jobId);
            const isEditing = editingId === application.id;

            return (
              <tr key={application.id} className="transition hover:bg-muted/60">
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{application.candidateName}</div>
                  <div className="text-xs text-muted-foreground">{application.contactEmail}</div>
                  {application.contactPhone && (
                    <div className="text-xs text-muted-foreground">{application.contactPhone}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{job?.title ?? '求人情報なし'}</div>
                  <div className="text-xs text-muted-foreground">{job?.company.name}</div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-foreground">{application.residenceStatus}</p>
                  <p className="text-xs text-muted-foreground">JLPT {application.jlptLevel}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', statusColours[application.status])}>
                    {statusOptions.find((option) => option.value === application.status)?.label ?? application.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={application.status}
                        onChange={(event) =>
                          onStatusChange(application.id, event.target.value as ApplicationStatus)
                        }
                        className="max-w-[160px]"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        閉じる
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditingId(application.id)}>
                      ステータス更新
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
