import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'btn-accent shadow-pop hover:shadow-pop hover:brightness-95 active:brightness-90',
  secondary:
    'bg-surface-2 text-[rgb(var(--text))] border border-app hover:bg-[rgb(var(--border))]',
  ghost:
    'bg-transparent text-[rgb(var(--text))] hover:bg-surface-2',
  outline:
    'bg-transparent border border-app text-[rgb(var(--text))] hover:bg-surface-2',
  danger:
    'bg-danger text-white border border-danger/80 hover:bg-danger/90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-base rounded-xl gap-2',
  icon: 'h-10 w-10 rounded-xl justify-center p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    leftIcon,
    rightIcon,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-[transform,filter,background,box-shadow] duration-150',
        'focus-ring active:translate-y-px',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
