import { CheckCircle2, Clock, Send, X, MinusCircle } from 'lucide-react';
import { STATUS_META } from '@/utils/constants';
import type { ApplicationStatus } from '@/types';
import { cn } from '@/utils/cn';

const ICONS: Record<ApplicationStatus, typeof Send> = {
  APPLIED: Send,
  INTERVIEW: Clock,
  OFFER: CheckCircle2,
  REJECTED: X,
  WITHDRAWN: MinusCircle,
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  const Icon = ICONS[status];
  return (
    <span className={cn(meta.pillClass, className)}>
      {showIcon && <Icon className="size-3" aria-hidden="true" />}
      {meta.label}
    </span>
  );
}
