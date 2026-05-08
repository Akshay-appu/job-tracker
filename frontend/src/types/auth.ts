/**
 * Auth DTOs — designed against the documented contract:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/refresh
 *
 * NOTE: If your AuthController uses different field names, adjust here.
 * The service layer (`authService.ts`) reads only from these types,
 * so a one-place edit will propagate everywhere.
 */

export interface User {
  id?: number | string;
  username?: string;
  name?: string;
  email: string;
  createdAt?: string;
  roles?: string[];
}

/** Request body for /api/auth/register. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** Request body for /api/auth/login. */
export interface LoginRequest {
  /** Most Spring Security setups accept either email or username here. */
  email: string;
  password: string;
}

/** Request body for /api/auth/refresh. */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * Common JJWT response shape. We're lenient with naming to handle a few
 * very common variations: `accessToken`/`token`, `refreshToken`, `tokenType`.
 */
export interface AuthResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: User;
  username?: string;
  email?: string;
}

/** Local auth state. */
export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
  user: User;
}
