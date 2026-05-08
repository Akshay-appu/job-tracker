import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the glass blur look — best for floating panels. */
  glass?: boolean;
  /** Make the card feel slightly raised. */
  elevated?: boolean;
  /** Remove the default padding so the consumer can compose. */
  unpadded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, glass, elevated, unpadded, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        glass ? 'glass rounded-2xl' : 'surface',
        !unpadded && 'p-5',
        elevated && 'shadow-soft-lg',
        className,
      )}
      {...rest}
    />
  );
});
