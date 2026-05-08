import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6', className)}>
      <div className="min-w-0">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-balance">{title}</h2>
        {description && (
          <p className="text-sm text-muted mt-1.5 max-w-xl text-pretty">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
