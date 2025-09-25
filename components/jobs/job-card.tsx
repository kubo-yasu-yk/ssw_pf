import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
  showManageActions?: boolean;
  onTogglePublish?: (job: Job) => void;
}

const formatSalary = (job: Job) => {
  const formatter = new Intl.NumberFormat('ja-JP');
  const { min, max, period } = job.salary;
  const periodLabel = period === 'monthly' ? '月給' : period === 'hourly' ? '時給' : '年収';
  return `${periodLabel} ${formatter.format(min)}〜${formatter.format(max)}円`;
};

export const JobCard = ({ job, showManageActions = false, onTogglePublish }: JobCardProps) => {
  return (
    <article className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-card">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{job.industry}</Badge>
          <Badge variant="outline">{job.jlptLevel} 以上</Badge>
          <Badge variant="outline">{job.employmentType === 'full-time' ? '正社員' : '契約/パート'}</Badge>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            <Link href={`/jobs/${job.id}`} className="hover:text-primary">
              {job.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{job.company.name}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{job.description}</p>
        <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            <span className="h-4 w-4 text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V21l6-3 6 3 6-3V3l-6 3-6-3-6 3z" />
              </svg>
            </span>
            {job.location.prefecture} {job.location.city}
          </li>
          <li className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            <span className="h-4 w-4 text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5 10.343 8 12 8Zm0 0v14" />
              </svg>
            </span>
            {formatSalary(job)}
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link href={`/jobs/${job.id}`} className="text-sm font-semibold text-primary hover:text-primary/80">
          詳細を見る
        </Link>
        {showManageActions && (
          <button
            type="button"
            onClick={() => onTogglePublish?.(job)}
            className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {job.isPublished ? '公開を停止' : '公開する'}
          </button>
        )}
      </div>
    </article>
  );
};
