/**
 * Application DTOs — match the documented endpoints:
 *   GET    /api/applications        (paginated, filterable by status & company)
 *   POST   /api/applications
 *   GET    /api/applications/{id}
 *   PUT    /api/applications/{id}
 *   DELETE /api/applications/{id}
 *   GET    /api/applications/stats
 */

export const APPLICATION_STATUSES = [
  'APPLIED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
  id: number | string;
  company: string;
  position: string;
  location?: string;
  status: ApplicationStatus;
  /** ISO date string — `applicationDate` is the most common JPA field name. */
  applicationDate: string;
  jobDescription?: string;
  notes?: string;
  salary?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload sent to POST and PUT. */
export interface JobApplicationInput {
  company: string;
  position: string;
  location?: string;
  status: ApplicationStatus;
  applicationDate: string;
  jobDescription?: string;
  notes?: string;
  salary?: string;
  link?: string;
}

/** Server-side filter / paging inputs for GET /api/applications. */
export interface ApplicationListQuery {
  page?: number;       // 0-indexed
  size?: number;
  sort?: string;       // e.g. "applicationDate,desc"
  status?: ApplicationStatus | '';
  company?: string;
  q?: string;          // free-text — falls back to client side search
}

/**
 * Stats endpoint shape.
 *
 * Spring controllers often return a Map<Status,Long> with uppercase keys.
 * We type both shapes and the service normalizes to a unified object.
 */
export interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

/** Raw stats shape that the backend may return — we normalize on the way in. */
export type RawApplicationStats =
  | Partial<Record<ApplicationStatus, number>>
  | Partial<Record<Lowercase<ApplicationStatus>, number>>
  | { total?: number; [k: string]: number | undefined };
