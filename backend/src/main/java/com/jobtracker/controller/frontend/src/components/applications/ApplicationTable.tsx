import { ChevronUp, ChevronDown, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { JobApplication } from '@/types';

interface ApplicationTableProps {
  applications: JobApplication[];
  loading?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onView: (a: JobApplication) => void;
  onEdit: (a: JobApplication) => void;
  onDelete: (a: JobApplication) => void;
}

interface ColumnSpec {
  key: keyof JobApplication | 'actions';
  label: string;
  sortField?: string;
  className?: string;
  hideOnSmall?: boolean;
}

const COLUMNS: ColumnSpec[] = [
  { key: 'position', label: 'Role', sortField: 'position' },
  { key: 'company', label: 'Company', sortField: 'company' },
  { key: 'location', label: 'Location', hideOnSmall: true },
  { key: 'status', label: 'Status', sortField: 'status' },
  { key: 'applicationDate', label: 'Applied', sortField: 'applicationDate' },
  { key: 'actions', label: '', className: 'text-right' },
];

export function ApplicationTable({
  applications,
  loading,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="surface overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-medium uppercase tracking-[0.12em] text-faint border-b border-app bg-surface-2/50">
              {COLUMNS.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={cn(
                    'px-4 py-3 whitespace-nowrap',
                    col.hideOnSmall && 'hidden md:table-cell',
                    col.className,
                  )}
                >
                  {col.sortField && onSort ? (
                    <button
                      onClick={() => onSort(col.sortField!)}
                      className="inline-flex items-center gap-1 hover:text-[rgb(var(--text))] focus-ring rounded"
                    >
                      {col.label}
                      {sortField === col.sortField && (
                        sortDirection === 'asc' ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-app last:border-0">
                    {COLUMNS.map((col) => (
                      <td key={String(col.key)} className={cn('px-4 py-3', col.hideOnSmall && 'hidden md:table-cell')}>
                        <Skeleton className="h-3 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : applications.map((app) => (
                  <tr
                    key={String(app.id)}
                    className="border-b border-app last:border-0 hover:bg-surface-2/40 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => onView(app)} className="font-medium hover:text-accent-500 transition-colors text-left focus-ring rounded">
                        {app.position}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted">{app.company}</td>
                    <td className="px-4 py-3 text-muted hidden md:table-cell">{app.location || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDate(app.applicationDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {app.link && (
                          <a
                            href={app.link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))] focus-ring"
                            aria-label="Open listing"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => onEdit(app)}
                          className="rounded-lg p-1.5 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))] focus-ring"
                          aria-label="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(app)}
                          className="rounded-lg p-1.5 text-faint hover:bg-danger/10 hover:text-danger focus-ring"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
