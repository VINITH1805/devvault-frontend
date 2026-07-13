import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);

  ngOnInit() {
    // When the app loads, check the URL for "?token=xyz..."
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.setToken(params['token']);
        
        // Clean the token out of the URL bar so it looks pretty!
        this.router.navigate([], {
          queryParams: { token: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }
}
