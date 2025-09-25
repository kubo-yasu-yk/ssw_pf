import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { JobCard } from '@/components/jobs/job-card';
import type { Job } from '@/types';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onTogglePublish?: (job: Job) => void;
  showManageActions?: boolean;
}

export const JobList = ({ jobs, isLoading = false, onTogglePublish, showManageActions = false }: JobListProps) => {
  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!jobs.length) {
    return (
      <EmptyState
        title="条件に合う求人がありません"
        description="検索条件を変更するか、公開中の求人を追加してください。"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onTogglePublish={onTogglePublish}
          showManageActions={showManageActions}
        />
      ))}
    </div>
  );
};
