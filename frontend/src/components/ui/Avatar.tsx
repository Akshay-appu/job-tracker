import { initials as toInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium tracking-tight',
        'bg-gradient-to-br from-accent-300 via-accent-400 to-accent-500 text-ink-950',
        'shadow-glass ring-1 ring-black/5',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {toInitials(name)}
    </span>
  );
}
