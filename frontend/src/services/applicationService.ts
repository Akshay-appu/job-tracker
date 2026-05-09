import api from './api';
import type { JobApplication, JobApplicationInput, ApplicationStats, PaginatedResponse } from '@/types';

// ── Normalize backend response → frontend type ────────────────────────────
function normalizeApp(raw: Record<string, unknown>): JobApplication {
  return {
    id: raw.id as number,
    company:         (raw.companyName   ?? raw.company         ?? '') as string,
    position:        (raw.jobTitle      ?? raw.position        ?? '') as string,
    location:        (raw.location      ?? '')                         as string,
    status:           raw.status                                       as JobApplication['status'],
    applicationDate: (raw.appliedDate   ?? raw.applicationDate ?? '') as string,
    jobDescription:  (raw.jobDescription ?? '')                        as string,
    notes:           (raw.notes         ?? '')                         as string,
    salary:          (raw.salaryRange   ?? raw.salary          ?? '') as string,
    link:            (raw.applicationUrl ?? raw.link           ?? '') as string,
  };
}

// ── Map frontend fields → backend request body ────────────────────────────
function toRequest(input: JobApplicationInput): Record<string, unknown> {
  return {
    companyName:    input.company,
    jobTitle:       input.position,
    location:       input.location     ?? '',
    status:         input.status,
    appliedDate:    input.applicationDate,
    jobDescription: input.jobDescription ?? '',
    notes:          input.notes         ?? '',
    salaryRange:    input.salary        ?? '',
    applicationUrl: input.link          ?? '',
  };
}

// ── Normalize stats keys (handles both UPPER and lower case) ─────────────
function normalizeStats(raw: Record<string, unknown>): ApplicationStats {
  const g = (a: string, b: string): number =>
    (raw[a] ?? raw[b] ?? 0) as number;
  return {
    total:     g('total',     'TOTAL'),
    applied:   g('applied',   'APPLIED'),
    interview: g('interview', 'INTERVIEW'),
    offer:     g('offer',     'OFFER'),
    rejected:  g('rejected',  'REJECTED'),
    withdrawn: g('withdrawn', 'WITHDRAWN'),
  };
}

export const applicationService = {
  async list(params?: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    company?: string;
  }): Promise<PaginatedResponse<JobApplication>> {
    const { data } = await api.get<Record<string, unknown>>('/applications', { params });
    // Handle both Page<T> and plain array responses
    if (Array.isArray(data)) {
      const arr = (data as Record<string, unknown>[]).map(normalizeApp);
      return { content: arr, totalElements: arr.length, totalPages: 1, number: 0, size: arr.length };
    }
    const page = data as { content?: Record<string, unknown>[]; totalElements?: number; totalPages?: number; number?: number; size?: number };
    return {
      content:       (page.content ?? []).map(normalizeApp),
      totalElements: page.totalElements ?? 0,
      totalPages:    page.totalPages    ?? 1,
      number:        page.number        ?? 0,
      size:          page.size          ?? 20,
    };
  },

  async getById(id: number | string): Promise<JobApplication> {
    const { data } = await api.get<Record<string, unknown>>(`/applications/${id}`);
    return normalizeApp(data);
  },

  async create(input: JobApplicationInput): Promise<JobApplication> {
    const { data } = await api.post<Record<string, unknown>>('/applications', toRequest(input));
    return normalizeApp(data);
  },

  async update(id: number | string, input: JobApplicationInput): Promise<JobApplication> {
    const { data } = await api.put<Record<string, unknown>>(`/applications/${id}`, toRequest(input));
    return normalizeApp(data);
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },

  async stats(): Promise<ApplicationStats> {
    const { data } = await api.get<Record<string, unknown>>('/applications/stats');
    return normalizeStats(data);
  },
};
