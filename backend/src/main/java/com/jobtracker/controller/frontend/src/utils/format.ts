/** Format an ISO date as "12 Mar 2026" — locale-aware fallback to en-GB. */
export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns "5 minutes ago", "yesterday", "3 days ago", etc. */
export function relativeTime(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return 'just now';
  if (min < 60) return `${min} min${min !== 1 ? 's' : ''} ago`;
  if (hr < 24) return `${hr} hr${hr !== 1 ? 's' : ''} ago`;
  if (day === 1) return 'yesterday';
  if (day < 30) return `${day} days ago`;
  const months = Math.round(day / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.round(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Bytes → human-readable. */
export function formatFileSize(bytes?: number | null): string {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Title-case a snake/UPPER status like "INTERVIEW" → "Interview". */
export function prettyStatus(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Get initials for an avatar: "Jane Doe" → "JD". Fallback to first 2 chars. */
export function initials(input: string | undefined | null): string {
  if (!input) return '?';
  const trimmed = input.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

/** ISO `yyyy-mm-dd` for HTML <input type=date>. */
export function toDateInputValue(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
