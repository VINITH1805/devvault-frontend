import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(Auth);

  loginWithGitHub() {
    window.location.href = `${environment.apiUrl}/auth/login`;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/dashboard';
  }
}
