import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Sparkles,
  Settings,
  User,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const PRIMARY_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: Briefcase },
  { to: '/resumes', label: 'Resumes', icon: FileText },
  { to: '/analyzer', label: 'AI Analyzer', icon: Sparkles },
];

const SECONDARY_NAV: NavItem[] = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
          'focus-ring',
          isActive
            ? 'bg-surface-2 text-[rgb(var(--text))] font-medium shadow-soft'
            : 'text-muted hover:bg-surface-2 hover:text-[rgb(var(--text))]',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-accent-400"
              aria-hidden="true"
            />
          )}
          <Icon className={cn('size-4', isActive ? 'text-accent-500' : 'text-faint group-hover:text-muted')} />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

interface SidebarProps {
  /** When the sidebar is rendered inside the mobile drawer, the consumer wants taps to close it. */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="h-full flex flex-col gap-6 px-4 py-5 bg-surface border-r border-app w-64 shrink-0">
      <div className="px-2">
        <Logo size="md" />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <nav aria-label="Primary" className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
            Workspace
          </p>
          {PRIMARY_NAV.map((item) => (
            <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </nav>

        <nav aria-label="Account" className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
            Account
          </p>
          {SECONDARY_NAV.map((item) => (
            <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-app bg-surface-2/60 p-3.5">
        <p className="text-xs font-medium">AI Engine v1</p>
        <p className="text-[11px] text-muted mt-0.5">
          Keyword + skill-alias matching, contextual suggestions.
        </p>
      </div>
    </aside>
  );
}
