import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/utils/cn';

interface MatchScoreProps {
  score: number; // 0-100
  size?: number;
  className?: string;
}

export function MatchScore({ score, size = 168, className }: MatchScoreProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated number
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => `${Math.round(v)}`);
  // Animated stroke offset
  const offset = useMotionValue(circumference);

  useEffect(() => {
    const c1 = animate(motionValue, safeScore, { duration: 1.0, ease: [0.22, 1, 0.36, 1] });
    const c2 = animate(offset, circumference - (safeScore / 100) * circumference, {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      c1.stop();
      c2.stop();
    };
  }, [safeScore, motionValue, offset, circumference]);

  const tier =
    safeScore >= 80
      ? { label: 'Strong match', color: '#10b981' }
      : safeScore >= 50
      ? { label: 'Solid match', color: '#a3ec0d' }
      : safeScore >= 30
      ? { label: 'Some overlap', color: '#f59e0b' }
      : { label: 'Low match', color: '#ef4444' };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(var(--border))"
          strokeWidth={10}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tier.color}
          strokeWidth={10}
          strokeLinecap="round"
          fill="transparent"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl tracking-tight tabular-nums">
          <motion.span>{rounded}</motion.span>
          <span className="text-faint text-2xl">%</span>
        </span>
        <span className="text-xs uppercase tracking-[0.16em] mt-1" style={{ color: tier.color }}>
          {tier.label}
        </span>
      </div>
    </div>
  );
}
