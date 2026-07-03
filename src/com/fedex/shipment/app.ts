import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'com-fedex-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public authService: AuthService) {}

  logout(): void {
    void this.authService.logout().catch((error) => {
      console.error('Okta logout failed:', error);
      window.location.href = '/login';
    });
  }
}
