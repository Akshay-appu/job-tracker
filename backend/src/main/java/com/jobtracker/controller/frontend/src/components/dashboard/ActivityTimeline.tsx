import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity } from 'lucide-react';
import { relativeTime, formatDate } from '@/utils/format';
import { STATUS_META } from '@/utils/constants';
import type { JobApplication } from '@/types';

interface ActivityTimelineProps {
  applications: JobApplication[];
  loading?: boolean;
}

export function ActivityTimeline({ applications, loading }: ActivityTimelineProps) {
  const events = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
      .slice(0, 8);
  }, [applications]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base tracking-tight">Activity</h3>
        <span className="text-[11px] text-faint uppercase tracking-[0.14em]">Latest events</span>
      </div>

      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </li>
          ))}
        </ul>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Activity className="size-5" />}
          title="No activity yet"
          description="Application updates will appear here as they happen."
        />
      ) : (
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute left-[13px] top-2 bottom-2 w-px bg-[rgb(var(--border))]"
          />
          {events.map((e) => {
            const meta = STATUS_META[e.status];
            return (
              <li key={String(e.id)} className="relative pl-9 pb-4 last:pb-0">
                <span
                  className="absolute left-0 top-1 size-7 rounded-full grid place-items-center bg-surface ring-1 ring-[rgb(var(--border))]"
                  style={{ color: meta.chartColor }}
                  aria-hidden="true"
                >
                  <span className="size-2 rounded-full" style={{ background: meta.chartColor }} />
                </span>
                <p className="text-sm">
                  <span className="font-medium">{e.position}</span>{' '}
                  <span className="text-muted">at {e.company}</span>
                </p>
                <p className="text-xs text-faint mt-0.5">
                  {meta.label} · {formatDate(e.applicationDate)} · {relativeTime(e.applicationDate)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
