import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SkillsCloudProps {
  skills: string[];
  variant?: 'matched' | 'missing' | 'neutral';
  emptyText?: string;
}

export function SkillsCloud({ skills, variant = 'neutral', emptyText = 'None' }: SkillsCloudProps) {
  if (!skills || skills.length === 0) {
    return <p className="text-sm text-faint">{emptyText}</p>;
  }
  const Icon = variant === 'matched' ? Check : variant === 'missing' ? Minus : null;
  const chipClass =
    variant === 'matched'
      ? 'bg-success/10 text-success border-success/30'
      : variant === 'missing'
      ? 'bg-danger/10 text-danger border-danger/30'
      : 'bg-surface-2 text-muted border-app';

  return (
    <ul className="flex flex-wrap gap-1.5">
      {skills.map((s, i) => (
        <motion.li
          key={`${s}-${i}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.4) }}
          className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs', chipClass)}
        >
          {Icon && <Icon className="size-3" aria-hidden="true" />}
          {s}
        </motion.li>
      ))}
    </ul>
  );
}
