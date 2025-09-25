'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RequireClientAuth } from '@/components/auth/require-client-auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { jobService, type JobInput } from '@/lib/job-service';
import type { EmploymentType, JLPTLevel } from '@/types';

interface FormState {
  title: string;
  industry: string;
  category: string;
  description: string;
  responsibilities: string;
  requirements: string;
  jlptLevel: JLPTLevel | '';
  prefecture: string;
  city: string;
  address: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: JobInput['salary']['period'];
  employmentType: EmploymentType;
  benefits: string;
  tags: string;
  companyName: string;
  companyDescription: string;
  companyEmail: string;
  companyWebsite: string;
  isPublished: boolean;
}

const defaultState: FormState = {
  title: '',
  industry: '',
  category: '',
  description: '',
  responsibilities: '',
  requirements: '',
  jlptLevel: '',
  prefecture: '',
  city: '',
  address: '',
  salaryMin: '',
  salaryMax: '',
  salaryPeriod: 'monthly',
  employmentType: 'full-time',
  benefits: '',
  tags: '',
  companyName: '',
  companyDescription: '',
  companyEmail: '',
  companyWebsite: '',
  isPublished: true,
};

const salaryPeriods: { value: JobInput['salary']['period']; label: string }[] = [
  { value: 'monthly', label: '月給' },
  { value: 'hourly', label: '時給' },
  { value: 'yearly', label: '年収' },
];

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: '正社員' },
  { value: 'contract', label: '契約社員' },
  { value: 'part-time', label: 'パート/アルバイト' },
  { value: 'temporary', label: '派遣/期間限定' },
];

const JobCreatePage = () => {
  const [form, setForm] = useState<FormState>(defaultState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jlptLevels = jobService.jlptLevels() as JLPTLevel[];

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setSuccess(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return '求人タイトルを入力してください。';
    if (!form.industry.trim()) return '業種を入力してください。';
    if (!form.description.trim()) return '仕事内容の説明を入力してください。';
    if (!form.jlptLevel) return '必要なJLPTレベルを選択してください。';
    if (!form.prefecture.trim()) return '勤務地（都道府県）を入力してください。';
    if (!form.city.trim()) return '勤務地（市区町村）を入力してください。';
    if (!form.salaryMin || !form.salaryMax) return '給与の範囲を入力してください。';
    if (!form.companyName.trim()) return '会社名を入力してください。';
    if (!form.companyEmail.trim()) return '問い合わせメールアドレスを入力してください。';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const input: JobInput = {
        title: form.title,
        industry: form.industry,
        category: form.category,
        description: form.description,
        responsibilities: form.responsibilities
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        jlptLevel: form.jlptLevel as JLPTLevel,
        location: {
          prefecture: form.prefecture,
          city: form.city,
          address: form.address || undefined,
        },
        salary: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax),
          currency: 'JPY',
          period: form.salaryPeriod,
        },
        benefits: form.benefits
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        employmentType: form.employmentType,
        isPublished: form.isPublished,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        company: {
          name: form.companyName,
          description: form.companyDescription,
          contactEmail: form.companyEmail,
          website: form.companyWebsite || undefined,
        },
      };

      jobService.create(input);
      setForm(defaultState);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('求人の作成に失敗しました。入力内容を確認してください。');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireClientAuth>
      <div className="container space-y-10 py-12">
        <div className="flex flex-col gap-4">
          <Link href="/client/jobs" className="text-sm font-semibold text-primary hover:text-primary-dark">
            ← 求人管理へ戻る
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">新規求人を作成</h1>
            <p className="text-sm text-muted-foreground">必要項目を入力し、求人を保存または公開します。</p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-border bg-card p-10 shadow-sm">
        <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm text-muted-foreground">
            求人タイトル
            <Input value={form.title} onChange={(event) => handleChange('title', event.target.value)} />
          </label>
        <label className="space-y-2 text-sm text-muted-foreground">
            業種
            <Input value={form.industry} onChange={(event) => handleChange('industry', event.target.value)} />
          </label>
        <label className="space-y-2 text-sm text-muted-foreground">
            職種カテゴリ
            <Input value={form.category} onChange={(event) => handleChange('category', event.target.value)} />
          </label>
        <label className="space-y-2 text-sm text-muted-foreground">
            必要JLPTレベル
            <Select
              value={form.jlptLevel}
              onChange={(event) => handleChange('jlptLevel', event.target.value as JLPTLevel)}
            >
              <option value="">選択してください</option>
              {jlptLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </label>
        </section>

        <section className="space-y-3">
          <label className="space-y-2 text-sm text-muted-foreground">
            仕事内容の説明
            <Textarea
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              rows={6}
            />
          </label>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-muted-foreground">
              具体的な業務内容（改行で区切り）
              <Textarea
                value={form.responsibilities}
                onChange={(event) => handleChange('responsibilities', event.target.value)}
                rows={6}
              />
            </label>
            <label className="space-y-2 text-sm text-muted-foreground">
              応募条件（改行で区切り）
              <Textarea
                value={form.requirements}
                onChange={(event) => handleChange('requirements', event.target.value)}
                rows={6}
              />
            </label>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <label className="space-y-2 text-sm text-muted-foreground">
            都道府県
            <Input value={form.prefecture} onChange={(event) => handleChange('prefecture', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            市区町村
            <Input value={form.city} onChange={(event) => handleChange('city', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            住所（任意）
            <Input value={form.address} onChange={(event) => handleChange('address', event.target.value)} />
          </label>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <label className="space-y-2 text-sm text-muted-foreground">
            給与（最小）
            <Input
              type="number"
              value={form.salaryMin}
              onChange={(event) => handleChange('salaryMin', event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            給与（最大）
            <Input
              type="number"
              value={form.salaryMax}
              onChange={(event) => handleChange('salaryMax', event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            支給単位
            <Select
              value={form.salaryPeriod}
              onChange={(event) => handleChange('salaryPeriod', event.target.value as FormState['salaryPeriod'])}
            >
              {salaryPeriods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </Select>
          </label>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted-foreground">
            福利厚生（改行で区切り）
            <Textarea
              value={form.benefits}
              onChange={(event) => handleChange('benefits', event.target.value)}
              rows={4}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            タグ（カンマ区切り）
            <Input value={form.tags} onChange={(event) => handleChange('tags', event.target.value)} />
          </label>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted-foreground">
            会社名
            <Input
              value={form.companyName}
              onChange={(event) => handleChange('companyName', event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            問い合わせメールアドレス
            <Input
              type="email"
              value={form.companyEmail}
              onChange={(event) => handleChange('companyEmail', event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground md:col-span-2">
            会社説明
            <Textarea
              value={form.companyDescription}
              onChange={(event) => handleChange('companyDescription', event.target.value)}
              rows={4}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            Webサイト（任意）
            <Input
              type="url"
              value={form.companyWebsite}
              onChange={(event) => handleChange('companyWebsite', event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-muted-foreground">
            雇用形態
            <Select
              value={form.employmentType}
              onChange={(event) => handleChange('employmentType', event.target.value as EmploymentType)}
            >
              {employmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </label>
        </section>

        <Checkbox
          checked={form.isPublished}
          onChange={(event) => handleChange('isPublished', event.target.checked)}
          label="公開状態で保存する"
        />

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {success && !error && (
          <p className="text-sm font-semibold text-emerald-600">求人を保存しました。</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isSubmitting}>
            求人を保存する
          </Button>
          <Link href="/client/jobs" className="text-sm font-semibold text-muted-foreground hover:text-primary/80">
            キャンセル
          </Link>
        </div>
      </form>
      </div>
    </RequireClientAuth>
  );
};

export default JobCreatePage;
