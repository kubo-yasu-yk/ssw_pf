'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { JLPTLevel } from '@/types';

export interface ApplicationFormValues {
  candidateName: string;
  contactEmail: string;
  contactPhone: string;
  residenceStatus: string;
  jlptLevel: JLPTLevel | '';
  experienceYears: string;
  message: string;
  consentToShare: boolean;
}

interface ApplicationFormProps {
  jobTitle: string;
  jlptLevels: JLPTLevel[];
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
}

export const ApplicationForm = ({ jobTitle, jlptLevels, onSubmit }: ApplicationFormProps) => {
  const [values, setValues] = useState<ApplicationFormValues>({
    candidateName: '',
    contactEmail: '',
    contactPhone: '',
    residenceStatus: '',
    jlptLevel: '',
    experienceYears: '',
    message: '',
    consentToShare: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.candidateName.trim()) {
      setError('氏名を入力してください。');
      return;
    }
    if (!values.contactEmail.trim()) {
      setError('メールアドレスを入力してください。');
      return;
    }
    if (!values.residenceStatus.trim()) {
      setError('在留資格を入力してください。');
      return;
    }
    if (!values.jlptLevel) {
      setError('JLPTレベルを選択してください。');
      return;
    }
    if (!values.consentToShare) {
      setError('個人情報の取り扱いに同意してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setIsSubmitted(true);
    } catch (submissionError) {
      setError('応募の送信に失敗しました。時間をおいて再度お試しください。');
      console.error(submissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/10 p-8 text-center">
        <p className="text-2xl font-semibold text-primary">応募を受け付けました</p>
        <p className="text-sm text-muted-foreground">
          {jobTitle} への応募ありがとうございます。採用担当者よりご連絡があるまでお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
      <div>
        <p className="text-lg font-semibold text-foreground">応募フォーム</p>
        <p className="text-sm text-muted-foreground">すべての必須項目を入力して送信してください。</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm text-muted-foreground">
          氏名<span className="ml-1 text-red-500">*</span>
          <Input
            value={values.candidateName}
            onChange={(event) => setValues((prev) => ({ ...prev, candidateName: event.target.value }))}
            placeholder="例: 山田 太郎"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          メールアドレス<span className="ml-1 text-red-500">*</span>
          <Input
            type="email"
            value={values.contactEmail}
            onChange={(event) => setValues((prev) => ({ ...prev, contactEmail: event.target.value }))}
            placeholder="example@email.com"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          電話番号
          <Input
            type="tel"
            value={values.contactPhone}
            onChange={(event) => setValues((prev) => ({ ...prev, contactPhone: event.target.value }))}
            placeholder="ハイフンなしで入力"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          在留資格<span className="ml-1 text-red-500">*</span>
          <Input
            value={values.residenceStatus}
            onChange={(event) => setValues((prev) => ({ ...prev, residenceStatus: event.target.value }))}
            placeholder="例: 特定技能1号"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          JLPT レベル<span className="ml-1 text-red-500">*</span>
          <Select
            value={values.jlptLevel}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, jlptLevel: event.target.value as JLPTLevel | '' }))
            }
          >
            <option value="">選択してください</option>
            {jlptLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          実務経験年数
          <Input
            type="number"
            min={0}
            value={values.experienceYears}
            onChange={(event) => setValues((prev) => ({ ...prev, experienceYears: event.target.value }))}
            placeholder="例: 3"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-muted-foreground">
        志望動機や自己PR
        <Textarea
          value={values.message}
          onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
          rows={5}
          placeholder="志望の理由やこれまでの経験などを記入してください。"
        />
      </label>
      <Checkbox
        checked={values.consentToShare}
        onChange={(event) => setValues((prev) => ({ ...prev, consentToShare: event.target.checked }))}
        label={
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">個人情報の取り扱い</span> に同意します。応募情報は企業と共有されることに同意します。
          </span>
        }
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" size="lg" loading={isSubmitting} className="w-full md:w-auto">
        応募内容を送信する
      </Button>
    </form>
  );
};
