import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Sparkles, TrendingUp, FileSearch } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-powered analysis',
    text: 'Match your resume against any job description in seconds.',
  },
  {
    icon: TrendingUp,
    title: 'Pipeline at a glance',
    text: 'Live status counts, charts, and an activity timeline.',
  },
  {
    icon: FileSearch,
    title: 'Find the gaps',
    text: 'See missing skills and suggestions automatically.',
  },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_minmax(420px,520px)]">
      <aside className="hidden lg:flex relative overflow-hidden bg-ink-950 text-ink-50">
        <div className="aurora absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center justify-between">
            <Logo size="lg" />
            
              href="https://github.com/Akshay-appu/job-tracker"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-ink-300 hover:text-ink-50 transition-colors"
            >
              View on GitHub
            </a>
          </div>

          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-300 mb-4">
              Find - filter - focus
            </p>
            <h1 className="font-display text-4xl xl:text-5xl tracking-tight leading-[1.1]">
              Turn your job search into a{' '}
              <span className="font-serif italic text-accent-300">system</span>.
            </h1>
            <p className="mt-5 text-ink-300">
              Trace is the AI co-pilot for ambitious applicants. Track every
              application, analyze every resume, and see where to focus next.
            </p>
          </div>

          <div className="grid gap-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start gap-3 rounded-xl border border-ink-800 bg-ink-900/60 p-3.5"
                >
                  <span className="rounded-lg bg-ink-800 p-2 text-accent-300">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{f.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10 bg-app relative">
        <div className="lg:hidden absolute top-6 left-6">
          <Logo size="md" />
        </div>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
