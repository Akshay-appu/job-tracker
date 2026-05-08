import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeWidget() {
  const { user } = useAuth();
  const name = (user?.name || user?.username || user?.email?.split('@')[0] || 'there').split(' ')[0];

  return (
    <Card className="relative overflow-hidden bg-ink-950 text-ink-50 border-ink-800">
      <div className="aurora absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid bg-grid-md opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/80 ring-1 ring-ink-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-300">
          <Sparkles className="size-3" />
          <span>Trace AI</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-2xl sm:text-3xl tracking-tight text-balance"
        >
          {greeting()},{' '}
          <span className="font-serif italic text-accent-300">{name}</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-1.5 text-sm text-ink-300 max-w-md"
        >
          Your job search at a glance — applications, interviews, and resume insights, all in one view.
        </motion.p>
      </div>
    </Card>
  );
}
