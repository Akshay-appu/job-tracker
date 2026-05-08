import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Monitor, Menu, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

interface TopbarProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  onOpenMobileNav?: () => void;
}

export function Topbar({ title, subtitle, actions, onOpenMobileNav }: TopbarProps) {
  const { user, logout } = useAuth();
  const { mode, setMode, resolved } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const cycleTheme = () => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  };

  const ThemeIcon = mode === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun;
  const themeLabel = mode === 'system' ? 'System' : resolved === 'dark' ? 'Dark' : 'Light';

  return (
    <header className="sticky top-0 z-30 border-b border-app bg-app/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden -ml-2 rounded-lg p-2 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))] focus-ring"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="font-display text-base sm:text-lg tracking-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-muted truncate hidden sm:block">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}

          <button
            onClick={cycleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-app bg-surface px-3 h-9 text-xs text-muted hover:text-[rgb(var(--text))] hover:bg-surface-2 transition-colors focus-ring"
            aria-label={`Theme: ${themeLabel}. Click to change.`}
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon className="size-3.5" />
            <span className="hidden md:inline">{themeLabel}</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl pl-1 pr-2.5 h-9 hover:bg-surface-2 transition-colors focus-ring"
              aria-label="Open user menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar name={user?.name || user?.username || user?.email} size="sm" />
              <span className="hidden md:block text-xs">
                <span className="block font-medium leading-tight max-w-[120px] truncate">
                  {user?.name || user?.username || user?.email?.split('@')[0]}
                </span>
                <span className="block text-faint leading-tight max-w-[120px] truncate">
                  {user?.email}
                </span>
              </span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  role="menu"
                  className={cn(
                    'absolute right-0 mt-2 w-56 origin-top-right surface p-1.5',
                    'shadow-soft-lg',
                  )}
                >
                  <div className="px-3 py-2 border-b border-app mb-1">
                    <p className="text-xs text-faint">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <MenuItem
                    icon={<User className="size-4" />}
                    label="Profile"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                  />
                  <MenuItem
                    icon={<SettingsIcon className="size-4" />}
                    label="Settings"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                  />
                  <div className="my-1 h-px bg-[rgb(var(--border))]" />
                  <MenuItem
                    icon={<LogOut className="size-4" />}
                    label="Log out"
                    danger
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors',
        'hover:bg-surface-2',
        danger ? 'text-danger' : 'text-[rgb(var(--text))]',
      )}
    >
      <span className={cn('text-faint', danger && 'text-danger')}>{icon}</span>
      {label}
    </button>
  );
}

// Surface a Link to silence unused-import warnings if extended later.
void Link;
