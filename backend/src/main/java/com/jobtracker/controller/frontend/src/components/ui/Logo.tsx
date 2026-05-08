import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
  className?: string;
}

const markSizes = { sm: 'size-7', md: 'size-9', lg: 'size-11' };
const wordmarkSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

/**
 * Trace logo: a sharp 3-line glyph implying a tracker / progress bar / lineage.
 */
export function Logo({ size = 'md', withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-xl bg-ink-950 text-accent-300 ring-1 ring-ink-800',
          'shadow-glass shrink-0',
          markSizes[size],
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" className="size-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 22h36M14 32h22M14 42h28"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className={cn('font-display tracking-tight', wordmarkSizes[size])}>
          Trace<span className="text-accent-400">.</span>
        </span>
      )}
    </span>
  );
}
