'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApplicationForm, type ApplicationFormValues } from '@/components/applications/application-form';
import { Badge } from '@/components/ui/badge';
import { applicationService } from '@/lib/application-service';
import { jobService } from '@/lib/job-service';
import type { Job, JLPTLevel } from '@/types';

interface ApplyJobClientProps {
  job: Job;
}

export const ApplyJobClient = ({ job }: ApplyJobClientProps) => {
  const [currentJob, setCurrentJob] = useState(job);
  const jlptLevels = useMemo(() => jobService.jlptLevels() as JLPTLevel[], []);

  useEffect(() => {
    const latest = jobService.findById(job.id);
    if (latest) {
      setCurrentJob(latest);
    }
  }, [job.id]);

  const handleSubmit = async (values: ApplicationFormValues) => {
    applicationService.create({
      jobId: currentJob.id,
      candidateName: values.candidateName,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      residenceStatus: values.residenceStatus,
      jlptLevel: values.jlptLevel || currentJob.jlptLevel,
      experienceYears: values.experienceYears ? Number(values.experienceYears) : undefined,
      message: values.message,
      consentToShare: values.consentToShare,
    });
  };

  return (
    <div className="container grid gap-10 py-12 lg:grid-cols-[2fr_1fr]">
      <ApplicationForm jobTitle={currentJob.title} jlptLevels={jlptLevels} onSubmit={handleSubmit} />
      <aside className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">応募求人</p>
          <h2 className="text-xl font-semibold text-foreground">{currentJob.title}</h2>
          <p className="text-sm text-muted-foreground">{currentJob.company.name}</p>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">勤務地</p>
            <p className="mt-1">
              {currentJob.location.prefecture} {currentJob.location.city}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">必要条件</p>
            <ul className="mt-2 space-y-1">
              <li>JLPT {currentJob.jlptLevel} 以上</li>
              {currentJob.requirements[0] && <li>{currentJob.requirements[0]}</li>}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">キーワード</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentJob.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
