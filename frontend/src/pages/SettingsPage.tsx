import { Sun, Moon, Monitor, LogOut, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, } from '@/hooks/useTheme';
import type { ThemeMode } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

const THEME_OPTIONS: Array<{ value: ThemeMode; label: string; description: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', description: 'Bright surfaces, ideal during the day.', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Easier on the eyes after dusk.', icon: Moon },
  { value: 'system', label: 'System', description: 'Match your operating system.', icon: Monitor },
];

export function SettingsPage() {
  const { mode, setMode } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings"
        description="Personalize Trace and manage your session."
      />

      <Card>
        <h3 className="font-display text-base tracking-tight">Appearance</h3>
        <p className="text-sm text-muted mt-1">Choose how Trace should look.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = mode === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={active}
                onClick={() => setMode(opt.value)}
                className={cn(
                  'group relative rounded-xl border p-4 text-left transition-all focus-ring',
                  active
                    ? 'border-accent-400 bg-accent-50/40 dark:bg-accent-300/5'
                    : 'border-app bg-surface hover:border-strong',
                )}
              >
                {active && (
                  <span
                    className="absolute top-3 right-3 inline-flex items-center justify-center size-5 rounded-full bg-accent-400 text-ink-950"
                    aria-hidden="true"
                  >
                    <Check className="size-3" />
                  </span>
                )}
                <Icon className={cn('size-5 mb-3', active ? 'text-accent-500' : 'text-faint')} />
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-muted mt-0.5">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base tracking-tight">Session</h3>
        <p className="text-sm text-muted mt-1">
          Signed in as <span className="font-medium text-[rgb(var(--text))]">{user?.email ?? 'unknown'}</span>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<LogOut className="size-4" />}
            onClick={logout}
          >
            Log out
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base tracking-tight">About</h3>
        <p className="text-sm text-muted mt-1">
          Trace · v1.0 · UI built with React + Vite + Tailwind. Backend powered by Spring Boot.
        </p>
      </Card>
    </div>
  );
}
