import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  // If already checked and authenticated, allow immediately
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise check with backend; redirect to login if not authenticated
  return authService.checkAuthStatus().pipe(
    map(user => {
      if (user && (user as any).authenticated !== false && authService.isAuthenticated()) {
        return true;
      }
      // Not authenticated – trigger Google login redirect
      authService.login();
      return false;
    })
  );
};

