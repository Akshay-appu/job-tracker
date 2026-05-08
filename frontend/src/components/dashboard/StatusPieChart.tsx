import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';
import type { ApplicationStats } from '@/types';
import { STATUS_META } from '@/utils/constants';

interface StatusPieChartProps {
  stats?: ApplicationStats;
  loading?: boolean;
}

export function StatusPieChart({ stats, loading }: StatusPieChartProps) {
  const data = useMemo(() => {
    if (!stats) return [];
    return [
      { name: STATUS_META.APPLIED.label, value: stats.applied, fill: STATUS_META.APPLIED.chartColor },
      { name: STATUS_META.INTERVIEW.label, value: stats.interview, fill: STATUS_META.INTERVIEW.chartColor },
      { name: STATUS_META.OFFER.label, value: stats.offer, fill: STATUS_META.OFFER.chartColor },
      { name: STATUS_META.REJECTED.label, value: stats.rejected, fill: STATUS_META.REJECTED.chartColor },
      { name: STATUS_META.WITHDRAWN.label, value: stats.withdrawn, fill: STATUS_META.WITHDRAWN.chartColor },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const isEmpty = !loading && data.length === 0;

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base tracking-tight">Pipeline distribution</h3>
        <span className="text-[11px] text-faint uppercase tracking-[0.14em]">By status</span>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<PieIcon className="size-5" />}
          title="Nothing to chart yet"
          description="Add your first application to see your pipeline here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.length === 0 ? [{ name: '', value: 1, fill: 'rgb(var(--border))' }] : data}
                  innerRadius="60%"
                  outerRadius="92%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive
                  animationDuration={700}
                >
                  {data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: 'rgb(var(--surface))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'rgb(var(--text))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid gap-2 text-sm">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full" style={{ background: d.fill }} aria-hidden="true" />
                <span className="text-muted flex-1">{d.name}</span>
                <span className="tabular-nums font-medium">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
