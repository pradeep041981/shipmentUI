import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

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
  private readonly apiBase = '';

  currentUser = signal<UserInfo | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Checks authentication status with the backend.
   * Uses session cookie (withCredentials).
   */
  checkAuthStatus(): Observable<UserInfo> {
    this.isLoading.set(true);
    return this.http.get<UserInfo>(`${this.apiBase}/auth/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.isLoading.set(false);
        return of({ authenticated: false } as unknown as UserInfo);
      })
    );
  }

  /**
   * Initiates Google SSO login by redirecting to the backend OAuth2 endpoint.
   */
  login(): void {
    window.location.href = `${this.apiBase}/oauth2/authorize/google`;
  }

  /**
   * Logs the user out by calling the backend logout endpoint, then reloads.
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }),
      catchError(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        return of(null);
      })
    );
  }
}

