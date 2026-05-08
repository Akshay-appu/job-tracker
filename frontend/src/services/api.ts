/**
 * Centralized axios instance.
 *
 * Responsibilities:
 *  1. Attach the JWT access token on every request.
 *  2. On 401 responses, try the refresh-token flow once, replay the request.
 *  3. Surface a clean, normalized error message regardless of backend shape.
 *
 * The base URL defaults to "/api" so the Vite dev proxy can forward to the
 * Spring Boot backend without CORS issues. Override with VITE_API_BASE_URL
 * when deploying to production with a remote backend.
 */
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { storage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- request interceptor: attach token --------------------------------
api.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ---- response interceptor: refresh-on-401, normalized errors ----------

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

/**
 * Listener emitted when the session is unauthenticated and unrecoverable.
 * AuthContext subscribes to this to perform a clean logout & redirect.
 */
type AuthFailureListener = () => void;
const authFailureListeners = new Set<AuthFailureListener>();
export function onAuthFailure(listener: AuthFailureListener) {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}
function emitAuthFailure() {
  authFailureListeners.forEach((cb) => cb());
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const newAccess = data.accessToken ?? data.token ?? null;
    const newRefresh = data.refreshToken ?? null;
    if (newAccess) storage.setAccessToken(newAccess);
    if (newRefresh) storage.setRefreshToken(newRefresh);
    return newAccess;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh path for the auth endpoints themselves
    const url = originalRequest?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest._retry = true;
            if (!originalRequest.headers) originalRequest.headers = new AxiosHeaders();
            (originalRequest.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;
      const newToken = await tryRefresh();
      isRefreshing = false;
      flushQueue(newToken);

      if (newToken) {
        if (!originalRequest.headers) originalRequest.headers = new AxiosHeaders();
        (originalRequest.headers as AxiosHeaders).set('Authorization', `Bearer ${newToken}`);
        return api(originalRequest);
      }

      // refresh failed → fully log out
      storage.clearSession();
      emitAuthFailure();
    }

    return Promise.reject(error);
  }
);

/** Extract the friendliest error message from a Spring Boot error body. */
export function extractErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!err) return fallback;
  const e = err as AxiosError<unknown>;
  const data = e.response?.data;
  if (typeof data === 'object' && data !== null) {
    const d = data as { message?: string; error?: string; errors?: { defaultMessage?: string; message?: string }[] };
    if (d.message) return d.message;
    if (d.error) return d.error;
    if (d.errors?.[0]?.defaultMessage) return d.errors[0].defaultMessage;
    if (d.errors?.[0]?.message) return d.errors[0].message;
  }
  if (e.message) return e.message;
  return fallback;
}
