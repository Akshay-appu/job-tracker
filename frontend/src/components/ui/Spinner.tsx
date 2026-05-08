import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = { sm: 'size-4', md: 'size-5', lg: 'size-8' };

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex', className)}>
      <Loader2 className={cn(sizes[size], 'animate-spin text-faint')} aria-hidden="true" />
    </span>
  );
}
