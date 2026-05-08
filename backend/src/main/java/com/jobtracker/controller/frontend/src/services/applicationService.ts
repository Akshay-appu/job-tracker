import { api } from './api';
import type {
  ApplicationListQuery,
  ApplicationStats,
  ApplicationStatus,
  JobApplication,
  JobApplicationInput,
  Page,
  RawApplicationStats,
} from '@/types';

/**
 * Application service — wraps the documented endpoints under /api/applications.
 *
 * `list()` returns the Spring Page<JobApplication> shape directly so the UI
 * can render server-side pagination. `stats()` normalizes the various stats
 * shapes into a single `ApplicationStats` record.
 */
export const applicationService = {
  async list(query: ApplicationListQuery = {}): Promise<Page<JobApplication>> {
    const params: Record<string, string | number> = {};
    if (query.page !== undefined) params.page = query.page;
    if (query.size !== undefined) params.size = query.size;
    if (query.sort) params.sort = query.sort;
    if (query.status) params.status = query.status;
    if (query.company) params.company = query.company;

    const { data } = await api.get<Page<JobApplication> | JobApplication[]>('/applications', {
      params,
    });

    // If backend returns a plain array (non-paginated), wrap it in a Page-shape.
    if (Array.isArray(data)) {
      return {
        content: data,
        totalElements: data.length,
        totalPages: 1,
        size: data.length,
        number: 0,
        first: true,
        last: true,
        empty: data.length === 0,
      };
    }
    return data;
  },

  async getById(id: number | string): Promise<JobApplication> {
    const { data } = await api.get<JobApplication>(`/applications/${id}`);
    return data;
  },

  async create(payload: JobApplicationInput): Promise<JobApplication> {
    const { data } = await api.post<JobApplication>('/applications', payload);
    return data;
  },

  async update(id: number | string, payload: JobApplicationInput): Promise<JobApplication> {
    const { data } = await api.put<JobApplication>(`/applications/${id}`, payload);
    return data;
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },

  async stats(): Promise<ApplicationStats> {
    const { data } = await api.get<RawApplicationStats>('/applications/stats');
    return normalizeStats(data);
  },
};

/** Normalizes the assorted stats shapes a Spring controller might return. */
export function normalizeStats(raw: RawApplicationStats | undefined): ApplicationStats {
  const obj = (raw ?? {}) as Record<string, number | undefined>;

  const lookup = (status: ApplicationStatus): number => {
    const upper = status;
    const lower = status.toLowerCase();
    return Number(obj[upper] ?? obj[lower] ?? 0);
  };

  const stats: ApplicationStats = {
    applied: lookup('APPLIED'),
    interview: lookup('INTERVIEW'),
    offer: lookup('OFFER'),
    rejected: lookup('REJECTED'),
    withdrawn: lookup('WITHDRAWN'),
    total: 0,
  };

  if (typeof obj.total === 'number') {
    stats.total = obj.total;
  } else {
    stats.total =
      stats.applied + stats.interview + stats.offer + stats.rejected + stats.withdrawn;
  }
  return stats;
}
