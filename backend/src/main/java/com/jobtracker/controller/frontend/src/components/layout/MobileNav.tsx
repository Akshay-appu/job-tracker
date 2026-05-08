import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="relative h-full">
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="absolute top-4 right-3 rounded-lg p-2 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))]"
              >
                <X className="size-5" />
              </button>
              <Sidebar onNavigate={onClose} />
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
