import { Injectable, signal } from '@angular/core';

export interface UserInfo {
  name: string;
  email: string;
  picture: string;
  sub: string;
  authenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';

  currentUser = signal<UserInfo | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Restore auth state from localStorage on service initialization
    this.loadFromStorage();
  }

  // ── Token helpers ──────────────────────────��─────────────────────────────────

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const decoded = this.decodeToken(token);
    if (decoded) {
      this.currentUser.set({
        name:          (decoded['name']    as string) ?? '',
        email:         (decoded['email']   as string) ?? (decoded['sub'] as string) ?? '',
        picture:       (decoded['picture'] as string) ?? '',
        sub:           (decoded['sub']     as string) ?? '',
        authenticated: true
      });
      this.isAuthenticated.set(true);
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  isTokenExpired(token?: string): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const decoded = this.decodeToken(t);
    if (!decoded?.['exp']) return true;
    return Date.now() >= (decoded['exp'] as number) * 1000;
  }

  // ── Auth actions ─────────────────────────────────────────────────────────────

  /** Redirect to Google OAuth2 (backend initiates the flow). */
  login(): void {
    window.location.href = '/oauth2/authorize/google';
  }

  /** Clear the stored JWT – no backend call required. */
  logout(): void {
    this.clearToken();
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private loadFromStorage(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.currentUser.set({
          name:          (decoded['name']    as string) ?? '',
          email:         (decoded['email']   as string) ?? (decoded['sub'] as string) ?? '',
          picture:       (decoded['picture'] as string) ?? '',
          sub:           (decoded['sub']     as string) ?? '',
          authenticated: true
        });
        this.isAuthenticated.set(true);
      }
    }
  }

  /**
   * Base64url-decode the JWT payload without verifying the signature.
   * Signature verification happens on the backend on every API request.
   */
  private decodeToken(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
