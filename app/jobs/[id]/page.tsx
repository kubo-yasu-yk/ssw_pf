import { notFound } from 'next/navigation';
import { JobDetailClient } from '@/components/jobs/job-detail-client';
import { initialJobs } from '@/data/initial-jobs';

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return initialJobs.map((job) => ({ id: job.id }));
}

const JobDetailPage = ({ params }: JobDetailPageProps) => {
  const job = initialJobs.find((item) => item.id === params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container py-12">
      <JobDetailClient job={job} />
    </div>
  );
};

export default JobDetailPage;
