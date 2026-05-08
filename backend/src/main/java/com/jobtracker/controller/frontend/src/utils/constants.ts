import type { ApplicationStatus } from '@/types';

/** UI metadata for each status. Used by badges, charts, filters. */
export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; pillClass: string; chartColor: string; ring: string }
> = {
  APPLIED:    { label: 'Applied',    pillClass: 'pill pill-applied',    chartColor: '#3b82f6', ring: 'ring-info/30' },
  INTERVIEW:  { label: 'Interview',  pillClass: 'pill pill-interview',  chartColor: '#f59e0b', ring: 'ring-warn/30' },
  OFFER:      { label: 'Offer',      pillClass: 'pill pill-offer',      chartColor: '#10b981', ring: 'ring-success/30' },
  REJECTED:   { label: 'Rejected',   pillClass: 'pill pill-rejected',   chartColor: '#ef4444', ring: 'ring-danger/30' },
  WITHDRAWN:  { label: 'Withdrawn',  pillClass: 'pill pill-withdrawn',  chartColor: '#9ca3af', ring: 'ring-gray-300' },
};

export const STATUS_OPTIONS = (Object.keys(STATUS_META) as ApplicationStatus[]).map((s) => ({
  value: s,
  label: STATUS_META[s].label,
}));

export const APP_NAME = 'Trace';
export const APP_TAGLINE = 'AI-powered job application intelligence';

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];
export const ALLOWED_RESUME_EXTS = ['.pdf', '.docx', '.doc'];
export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
