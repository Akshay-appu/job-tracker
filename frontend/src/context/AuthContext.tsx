import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '@/services/authService';
import { onAuthFailure } from '@/services/api';
import type { AuthSession, LoginRequest, RegisterRequest, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  /** Patch the user record in memory after a profile edit. */
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const restored = authService.hydrate();
    setSession(restored);
    setIsLoading(false);
  }, []);

  // Subscribe to global auth-failure events from the axios interceptor
  useEffect(() => {
    const off = onAuthFailure(() => setSession(null));
    return () => {
      off();
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const next = await authService.login(payload);
    setSession(next);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const next = await authService.register(payload);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const setUser = useCallback((user: User) => {
    setSession((prev) => (prev ? { ...prev, user } : prev));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: !!session?.accessToken,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [session, isLoading, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
