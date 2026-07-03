import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

/**
 * Handles the Okta OpenID Connect callback in the frontend.
 */
@Component({
  selector: 'com-fedex-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <div class="fedex-logo">
          <span class="logo-fed">Fed</span><span class="logo-ex">Ex</span>
        </div>
        <p *ngIf="!error">Signing you in…</p>
        <p *ngIf="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4d148c 0%, #ff6200 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .callback-card {
      background: #fff;
      border-radius: 16px;
      padding: 48px 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .fedex-logo { font-size: 2.5rem; font-weight: 900; margin-bottom: 16px; }
    .logo-fed { color: #4d148c; }
    .logo-ex  { color: #ff6200; }
    p { color: #555; font-size: 1rem; }
    .error-msg { color: #d32f2f; }
  `]
})
export class AuthCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    void this.completeLogin();
  }

  private async completeLogin(): Promise<void> {
    try {
      await this.authService.handleLoginCallback();
      this.router.navigate(['/'], { replaceUrl: true });
    } catch {
      this.error = 'Authentication failed. Please try signing in again.';
      setTimeout(() => this.router.navigate(['/login']), 3000);
    }
  }
}
