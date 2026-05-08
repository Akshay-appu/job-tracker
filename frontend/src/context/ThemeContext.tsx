import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'trace.theme';

interface ThemeContextValue {
  mode: ThemeMode;
  /** The actually-resolved theme right now (after honoring `system`). */
  resolved: 'light' | 'dark';
  setMode: (m: ThemeMode) => void;
  /** Convenience: flips between light and dark (no system). */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStored(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* ignore */
  }
  return 'system';
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

function applyToDom(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored());
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveMode(readStored()));

  useEffect(() => {
    const r = resolveMode(mode);
    setResolved(r);
    applyToDom(r);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  // React to OS-level changes when in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const r = mq.matches ? 'dark' : 'light';
      setResolved(r);
      applyToDom(r);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const toggle = useCallback(() => {
    setModeState((prev) => {
      const r = resolveMode(prev);
      return r === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
