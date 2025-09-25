import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Job } from '@/types';

interface JobDetailProps {
  job: Job;
}

const formatSalary = (job: Job) => {
  const formatter = new Intl.NumberFormat('ja-JP');
  const { min, max, period } = job.salary;
  const periodLabel = period === 'monthly' ? '月給' : period === 'hourly' ? '時給' : '年収';
  return `${periodLabel} ${formatter.format(min)}〜${formatter.format(max)}円`;
};

export const JobDetail = ({ job }: JobDetailProps) => {
  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{job.industry}</Badge>
              <Badge variant="outline">{job.jlptLevel} 以上</Badge>
              <Badge variant="outline">{job.employmentType === 'full-time' ? '正社員' : '契約/パート'}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
            <p className="text-sm text-muted-foreground">{job.company.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/apply/${job.id}`}>
              <Button size="lg">この求人に応募する</Button>
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide">勤務地</p>
            <p className="mt-2 text-base font-semibold text-secondary-foreground">
              {job.location.prefecture} {job.location.city}
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide">お給料</p>
            <p className="mt-2 text-base font-semibold text-secondary-foreground">{formatSalary(job)}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide">募集の状況</p>
            <p className="mt-2 text-base font-semibold text-secondary-foreground">
              {job.isPublished ? '募集中' : '募集停止中'}
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">仕事の内容</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">応募の条件</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {job.requirements.map((requirement) => (
                <li key={requirement} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
            <div>
              <h3 className="text-sm font-semibold text-foreground">福利厚生</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {job.benefits.map((benefit) => (
                  <li key={benefit} className="rounded-full border border-border px-3 py-1">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
      <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">企業情報</h2>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>{job.company.description}</p>
          <p>
            <span className="font-semibold">お問い合わせ:</span> {job.company.contactEmail}
          </p>
          {job.company.website && (
            <p>
              <span className="font-semibold">Webサイト:</span>{' '}
              <a href={job.company.website} className="text-primary hover:text-primary/80" target="_blank" rel="noreferrer">
                {job.company.website}
              </a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
