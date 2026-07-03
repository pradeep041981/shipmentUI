import { Injectable, signal } from '@angular/core';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';

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
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_INFO_KEY = 'user_info';

  // Replace these values with your Okta app settings.
  private readonly oktaIssuer = 'https://{yourOktaDomain}/oauth2/default';
  private readonly oktaClientId = '{yourOktaClientId}';
  private readonly oktaAuth = new OktaAuth({
    issuer: this.oktaIssuer,
    clientId: this.oktaClientId,
    redirectUri: `${window.location.origin}/auth/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true
  });

  currentUser = signal<UserInfo | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadFromStorage();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string, userClaims?: Record<string, unknown> | null): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const claims = userClaims ?? this.decodeToken(token);
    if (claims) {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(claims));
      this.currentUser.set(this.mapClaimsToUserInfo(claims));
      this.isAuthenticated.set(true);
      return;
    }

    this.currentUser.set({
      name: '',
      email: '',
      picture: '',
      sub: '',
      authenticated: true
    });
    this.isAuthenticated.set(true);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
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

  async login(): Promise<void> {
    if (this.isOktaConfigInvalid()) {
      throw new Error('Okta configuration is not set. Update issuer and clientId in AuthService.');
    }

    await this.oktaAuth.signInWithRedirect();
  }

  async handleLoginCallback(): Promise<void> {
    const { tokens } = await this.oktaAuth.token.parseFromUrl();
    this.oktaAuth.tokenManager.setTokens(tokens);

    const accessToken = tokens.accessToken?.accessToken;
    if (!accessToken) {
      throw new Error('Okta callback did not return an access token.');
    }

    this.setToken(accessToken, this.extractUserClaims(tokens));
  }

  async logout(): Promise<void> {
    this.clearToken();
    if (this.isOktaConfigInvalid()) {
      return;
    }

    await this.oktaAuth.signOut({
      clearTokensBeforeRedirect: true,
      postLogoutRedirectUri: `${window.location.origin}/login`
    });
  }

  private loadFromStorage(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const storedUserInfo = this.getStoredUserInfo();
      const decoded = storedUserInfo ?? this.decodeToken(token);
      if (decoded) this.currentUser.set(this.mapClaimsToUserInfo(decoded));
      this.isAuthenticated.set(true);
    }
  }

  private decodeToken(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private getStoredUserInfo(): Record<string, unknown> | null {
    const raw = localStorage.getItem(this.USER_INFO_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  private extractUserClaims(tokens: Tokens): Record<string, unknown> | null {
    if (tokens.idToken?.claims) return tokens.idToken.claims as Record<string, unknown>;
    if (tokens.accessToken?.claims) return tokens.accessToken.claims as Record<string, unknown>;
    return null;
  }

  private mapClaimsToUserInfo(claims: Record<string, unknown>): UserInfo {
    return {
      name: (claims['name'] as string) ?? '',
      email: ((claims['email'] as string) ?? (claims['preferred_username'] as string) ?? (claims['sub'] as string) ?? ''),
      picture: (claims['picture'] as string) ?? '',
      sub: (claims['sub'] as string) ?? '',
      authenticated: true
    };
  }

  private isOktaConfigInvalid(): boolean {
    return this.oktaIssuer.includes('{yourOktaDomain}') || this.oktaClientId.includes('{yourOktaClientId}');
  }
}
