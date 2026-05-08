/**
 * Common API types shared across the app.
 *
 * The Spring Boot backend follows standard Spring Data conventions:
 * - paginated responses come back as a Spring `Page<T>` JSON
 * - errors come back as `{ status, error, message, path, timestamp }`
 *
 * If your backend deviates, adjust here only.
 */

/** Spring Data pagination response shape. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/** Standard Spring Boot error envelope. */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
}

/** Optional sort directive used by the backend list endpoints. */
export interface SortSpec {
  field: string;
  direction: 'asc' | 'desc';
}
