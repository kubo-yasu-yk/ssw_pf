import { notFound } from 'next/navigation';
import { ApplyJobClient } from '@/components/applications/apply-job-client';
import { initialJobs } from '@/data/initial-jobs';

interface ApplyPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return initialJobs.map((job) => ({ id: job.id }));
}

const ApplyPage = ({ params }: ApplyPageProps) => {
  const job = initialJobs.find((item) => item.id === params.id);

  if (!job) {
    notFound();
  }

  return <ApplyJobClient job={job} />;
};

export default ApplyPage;
