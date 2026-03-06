import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'com-fedex-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Check session status on app startup so the guard has up-to-date info
    this.authService.checkAuthStatus().subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login';
    });
  }
}
