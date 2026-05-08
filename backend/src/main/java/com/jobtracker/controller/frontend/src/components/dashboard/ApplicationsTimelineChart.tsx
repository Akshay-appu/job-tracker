import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import type { JobApplication } from '@/types';

interface ApplicationsTimelineChartProps {
  applications: JobApplication[];
  loading?: boolean;
}

/** Bin applications by ISO week for a 12-week trailing window. */
function buildSeries(apps: JobApplication[]) {
  const now = new Date();
  const weeks: { key: string; label: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    weeks.push({ key, label, count: 0 });
  }

  apps.forEach((a) => {
    const date = new Date(a.applicationDate);
    if (Number.isNaN(date.getTime())) return;
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 7 * 12) return;
    const idx = 11 - Math.floor(diffDays / 7);
    if (idx >= 0 && idx < weeks.length) weeks[idx].count += 1;
  });

  return weeks;
}

export function ApplicationsTimelineChart({ applications, loading }: ApplicationsTimelineChartProps) {
  const data = useMemo(() => buildSeries(applications), [applications]);

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base tracking-tight">Activity over time</h3>
        <span className="text-[11px] text-faint uppercase tracking-[0.14em]">Last 12 weeks</span>
      </div>

      <div className="h-56">
        {loading ? (
          <div className="shimmer h-full w-full rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a3ec0d" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#a3ec0d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'rgb(var(--text-faint))' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'rgb(var(--text-faint))' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={32}
              />
              <Tooltip
                cursor={{ stroke: 'rgb(var(--border-strong))' }}
                contentStyle={{
                  background: 'rgb(var(--surface))',
                  border: '1px solid rgb(var(--border))',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'rgb(var(--text))',
                }}
                labelStyle={{ color: 'rgb(var(--text-muted))' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#86c700"
                strokeWidth={2}
                fill="url(#lineFill)"
                isAnimationActive
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
