import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { formatDate, relativeTime } from '@/utils/format';
import type { JobApplication } from '@/types';

interface RecentApplicationsProps {
  applications: JobApplication[];
  loading?: boolean;
}

export function RecentApplications({ applications, loading }: RecentApplicationsProps) {
  return (
    <Card unpadded className="overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-4">
        <h3 className="font-display text-base tracking-tight">Recent applications</h3>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-[rgb(var(--text))] transition-colors"
        >
          View all <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {loading ? (
        <ul className="divide-y divide-[rgb(var(--border))]">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-3">
              <Skeleton className="size-9 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-2.5 w-1/4" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </li>
          ))}
        </ul>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="size-5" />}
          title="No applications yet"
          description="Once you add applications they'll surface here."
        />
      ) : (
        <ul className="divide-y divide-[rgb(var(--border))]">
          {applications.slice(0, 6).map((app) => (
            <li key={String(app.id)} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2/50 transition-colors">
              <div className="size-9 shrink-0 rounded-xl bg-surface-2 grid place-items-center text-xs font-semibold text-muted">
                {app.company?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{app.position}</p>
                <p className="text-xs text-faint truncate">
                  {app.company}
                  {app.location ? ` · ${app.location}` : ''}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 text-right">
                <span className="text-xs text-muted">{formatDate(app.applicationDate)}</span>
                <span className="text-[11px] text-faint">{relativeTime(app.applicationDate)}</span>
              </div>
              <StatusBadge status={app.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
