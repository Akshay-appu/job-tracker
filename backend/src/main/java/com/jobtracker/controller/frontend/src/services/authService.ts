import { api } from './api';
import type {
  AuthResponse,
  AuthSession,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  User,
} from '@/types';
import { storage } from '@/utils/storage';

/**
 * Auth service.
 *
 * Maps the backend's auth endpoints to a clean session shape we can store
 * locally. The response shape varies in the wild — this normalizer handles
 * the common JJWT / Spring Security combinations.
 */

function normalizeAuthResponse(data: AuthResponse, fallbackEmail?: string): AuthSession {
  const accessToken = data.accessToken ?? data.token ?? '';
  if (!accessToken) {
    throw new Error('Server did not return an access token.');
  }
  const refreshToken = data.refreshToken ?? null;
  const user: User = data.user ?? {
    email: data.email ?? fallbackEmail ?? '',
    username: data.username,
  };
  return { accessToken, refreshToken, user };
}

export const authService = {
  async register(payload: RegisterRequest): Promise<AuthSession> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    // Some backends return only "user created" with no token — handle that gracefully.
    if (!data || (!data.accessToken && !data.token)) {
      // Auto-login after register
      return authService.login({ email: payload.email, password: payload.password });
    }
    const session = normalizeAuthResponse(data, payload.email);
    persist(session);
    return session;
  },

  async login(payload: LoginRequest): Promise<AuthSession> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    const session = normalizeAuthResponse(data, payload.email);
    persist(session);
    return session;
  },

  async refresh(payload: RefreshRequest): Promise<AuthSession> {
    const { data } = await api.post<AuthResponse>('/auth/refresh', payload);
    const session = normalizeAuthResponse(data);
    persist(session);
    return session;
  },

  logout(): void {
    storage.clearSession();
  },

  /** Hydrate the in-memory session from localStorage on app boot. */
  hydrate(): AuthSession | null {
    const accessToken = storage.getAccessToken();
    const user = storage.getUser();
    if (!accessToken || !user) return null;
    return {
      accessToken,
      refreshToken: storage.getRefreshToken(),
      user,
    };
  },
};

function persist(session: AuthSession) {
  storage.setAccessToken(session.accessToken);
  if (session.refreshToken) storage.setRefreshToken(session.refreshToken);
  storage.setUser(session.user);
}
