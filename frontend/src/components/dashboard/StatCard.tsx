import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: string; // text color e.g. 'text-info'
  loading?: boolean;
  delay?: number;
}

function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toString());

  useEffect(() => {
    const controls = animate(motionValue, to, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      delay,
    });
    return () => controls.stop();
  }, [motionValue, to, delay]);

  return <motion.span>{rounded}</motion.span>;
}

export function StatCard({ label, value, hint, icon, accent, loading, delay }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{label}</p>
          <div className={cn('mt-2 font-display text-4xl tracking-tight tabular-nums', accent)}>
            {loading ? <Skeleton className="h-9 w-20" /> : <CountUp to={value} delay={delay} />}
          </div>
          {hint && !loading && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <div className={cn('rounded-xl bg-surface-2 p-2 text-faint', accent && 'text-current')}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
