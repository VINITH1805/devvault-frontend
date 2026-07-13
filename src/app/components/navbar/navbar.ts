import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(Auth);

  loginWithGitHub() {
    window.location.href = 'http://localhost:5282/api/auth/login';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/dashboard';
  }
}
