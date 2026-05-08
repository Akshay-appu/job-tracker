import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

/** Shimmer placeholder block — composes via Tailwind sizing classes. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer rounded-md', className)}
      aria-hidden="true"
    />
  );
}
