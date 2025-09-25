export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | '未取得';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'temporary';

export type ApplicationStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface JobLocation {
  prefecture: string;
  city: string;
  address?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: 'JPY';
  period: 'monthly' | 'hourly' | 'yearly';
}

export interface CompanyProfile {
  name: string;
  description: string;
  contactEmail: string;
  website?: string;
}

export interface Job {
  id: string;
  title: string;
  industry: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  jlptLevel: JLPTLevel;
  location: JobLocation;
  salary: SalaryRange;
  benefits: string[];
  employmentType: EmploymentType;
  isPublished: boolean;
  tags: string[];
  company: CompanyProfile;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilter {
  keyword?: string;
  prefecture?: string;
  jlptLevel?: JLPTLevel;
  industry?: string;
  employmentType?: EmploymentType;
  isPublished?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  contactEmail: string;
  contactPhone?: string;
  residenceStatus: string;
  jlptLevel: JLPTLevel;
  experienceYears?: number;
  message?: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  consentToShare: boolean;
}

export interface StorageRecord<T> {
  version: number;
  data: T;
  updatedAt: string;
}

export interface PlatformError {
  code: string;
  message: string;
  details?: string;
  cause?: unknown;
}

export interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApplicantSummary {
  jobId: string;
  jobTitle: string;
  totalApplicants: number;
  groupedByStatus: Record<ApplicationStatus, number>;
}
