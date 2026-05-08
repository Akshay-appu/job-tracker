import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leftIcon,
    rightSlot,
    id,
    className,
    containerClassName,
    ...rest
  },
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
          'transition-shadow duration-150 focus-within:border-strong',
          'focus-within:ring-2 focus-within:ring-accent-300/40 focus-within:ring-offset-0',
          error && 'border-danger/60 focus-within:ring-danger/30 focus-within:border-danger',
        )}
      >
        {leftIcon && (
          <span className="pl-3 text-faint flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 flex-1 bg-transparent px-3 text-sm placeholder:text-faint outline-none',
            leftIcon && 'pl-2',
            rightSlot && 'pr-2',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {rightSlot && <span className="pr-2 flex items-center">{rightSlot}</span>}
      </div>
      {error ? (
        <p id={`${inputId}-err`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
