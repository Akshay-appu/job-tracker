import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, id, className, containerClassName, children, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative flex items-center rounded-xl border border-app bg-surface',
          'focus-within:border-strong focus-within:ring-2 focus-within:ring-accent-300/40',
          error && 'border-danger/60',
        )}
      >
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full appearance-none bg-transparent pl-3 pr-9 text-sm outline-none',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="size-4 absolute right-3 text-faint pointer-events-none" aria-hidden="true" />
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
});
