'use client';

import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { EmploymentType, JLPTLevel, JobFilter } from '@/types';

interface JobFiltersProps {
  filters: JobFilter;
  prefectures: string[];
  industries: string[];
  jlptLevels: JLPTLevel[];
  onFilterChange: (filters: JobFilter) => void;
}

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: '正社員' },
  { value: 'contract', label: '契約社員' },
  { value: 'part-time', label: 'パート/アルバイト' },
  { value: 'temporary', label: '派遣/期間限定' },
];

export const JobFilters = ({ filters, prefectures, industries, jlptLevels, onFilterChange }: JobFiltersProps) => {
  const handleChange = (payload: Partial<JobFilter>) => {
    onFilterChange({ ...filters, ...payload });
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange({ [event.target.name]: event.target.value } as Partial<JobFilter>);
  };

  const handleReset = () => {
    onFilterChange({
      keyword: '',
      prefecture: undefined,
      industry: undefined,
      jlptLevel: undefined,
      employmentType: undefined,
      isPublished: true,
    });
  };

  return (
    <section className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">求人を検索</p>
          <p className="text-sm text-muted-foreground">希望条件で求人を絞り込みできます。</p>
        </div>
        <Button variant="outline" onClick={handleReset} className="self-start md:self-auto">
          条件をリセット
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm text-muted-foreground">
          キーワード
          <Input
            name="keyword"
            value={filters.keyword ?? ''}
            onChange={handleInput}
            placeholder="職種、企業名、地域など"
          />
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          勤務地（都道府県）
          <Select
            value={filters.prefecture ?? ''}
            onChange={(event) =>
              handleChange({ prefecture: event.target.value || undefined })
            }
          >
            <option value="">指定しない</option>
            {prefectures.map((prefecture) => (
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          業種
          <Select
            value={filters.industry ?? ''}
            onChange={(event) => handleChange({ industry: event.target.value || undefined })}
          >
            <option value="">指定しない</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          JLPT レベル
          <Select
            value={filters.jlptLevel ?? ''}
            onChange={(event) =>
              handleChange({ jlptLevel: (event.target.value as JLPTLevel) || undefined })
            }
          >
            <option value="">指定しない</option>
            {jlptLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          雇用形態
          <Select
            value={filters.employmentType ?? ''}
            onChange={(event) =>
              handleChange({ employmentType: (event.target.value as EmploymentType) || undefined })
            }
          >
            <option value="">指定しない</option>
            {employmentTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </label>
      </div>
    </section>
  );
};
