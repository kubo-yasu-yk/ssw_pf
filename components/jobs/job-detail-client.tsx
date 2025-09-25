'use client';

import { useEffect, useState } from 'react';
import { JobDetail } from '@/components/jobs/job-detail';
import { jobService } from '@/lib/job-service';
import type { Job } from '@/types';

interface JobDetailClientProps {
  job: Job;
}

export const JobDetailClient = ({ job }: JobDetailClientProps) => {
  const [currentJob, setCurrentJob] = useState(job);

  useEffect(() => {
    const latest = jobService.findById(job.id);
    if (latest) {
      setCurrentJob(latest);
    }
  }, [job.id]);

  return <JobDetail job={currentJob} />;
};
