/**
 * Simple localStorage wrapper with safe SSR/Privacy-mode fallbacks.
 *
 * Stores access + refresh tokens and a serialized user object.
 */
import type { User } from '@/types';

const KEYS = {
  accessToken: 'trace.accessToken',
  refreshToken: 'trace.refreshToken',
  user: 'trace.user',
} as const;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storage = {
  getAccessToken: (): string | null => safeGet(KEYS.accessToken),
  setAccessToken: (token: string) => safeSet(KEYS.accessToken, token),
  clearAccessToken: () => safeRemove(KEYS.accessToken),

  getRefreshToken: (): string | null => safeGet(KEYS.refreshToken),
  setRefreshToken: (token: string) => safeSet(KEYS.refreshToken, token),
  clearRefreshToken: () => safeRemove(KEYS.refreshToken),

  getUser: (): User | null => {
    const raw = safeGet(KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setUser: (user: User) => safeSet(KEYS.user, JSON.stringify(user)),
  clearUser: () => safeRemove(KEYS.user),

  clearSession: () => {
    safeRemove(KEYS.accessToken);
    safeRemove(KEYS.refreshToken);
    safeRemove(KEYS.user);
  },
};
