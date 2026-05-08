import { Fragment, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  // Lock body scroll while open + Escape to close
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'glass rounded-2xl w-full pointer-events-auto shadow-soft-lg',
                'flex flex-col max-h-[calc(100vh-2rem)]',
                sizeClasses[size],
                className,
              )}
            >
              {(title || description) && (
                <div className="flex items-start gap-3 p-5 border-b border-app">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="font-display text-lg tracking-tight">{title}</h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-muted">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-lg p-1.5 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))] transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <div className="p-5 overflow-y-auto flex-1">{children}</div>
              {footer && (
                <div className="p-4 border-t border-app flex justify-end gap-2 bg-surface-2/40 rounded-b-2xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body,
  );
}
