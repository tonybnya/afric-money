import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar" role="navigation" aria-label="Navigation principale">
      <div class="container navbar-inner">

        <!-- Logo -->
        <a routerLink="/" class="navbar-logo" aria-label="Accueil @fric Money">
          <img src="/img/logo.png" alt="@fric Money" width="90" height="44" class="navbar-logo-img" />
        </a>

        <!-- Nav links -->
        <ul class="navbar-links" role="list">
          <li><a routerLink="/" routerLinkActive="active" class="nav-link">Accueil</a></li>
          <li><a href="#" class="nav-link">A propos</a></li>
          <li><a href="#" class="nav-link">Agences</a></li>
          <li><a href="#" class="nav-link">Partenaires</a></li>
          <li><a href="#" class="nav-link">Blog</a></li>
          <li><a href="#" class="nav-link">FAQ</a></li>
          <li><a href="#" class="nav-link">Nous Contacter</a></li>
        </ul>

        <!-- Right actions -->
        <div class="navbar-actions">
          <button class="lang-btn" type="button" aria-label="Changer la langue">
            <span>🇫🇷</span> FR
            <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
          </button>

          @if (authService.isAuthenticated()) {
            <span class="nav-welcome">Bienvenue, <strong>{{ authService.currentUser()?.name || 'Client' }}</strong></span>
            <a routerLink="/dashboard" class="btn-primary">Mon Compte</a>
            <button type="button" class="btn-outline" (click)="logout()">Déconnexion</button>
          } @else {
            <a routerLink="/login" class="btn-outline">Se Connecter</a>
            <a routerLink="/register" class="btn-primary">S'Inscrire</a>
          }
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #fff;
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .navbar-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      height: 60px;
    }
    .navbar-logo {
      text-decoration: none;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .navbar-logo-img {
      height: 44px;
      width: auto;
      display: block;
    }
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      flex: 1;
    }
    .nav-link {
      text-decoration: none;
      color: var(--color-text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      transition: color 0.15s ease;
      white-space: nowrap;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--color-primary);
    }
    .nav-link.active {
      font-weight: 700;
      border-bottom: 2px solid var(--color-primary);
      border-radius: 0;
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-base);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      transition: background 0.15s;
    }
    .lang-btn:hover { background: var(--color-primary-light); }
    .nav-welcome {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-right: 0.5rem;
    }
    .nav-welcome strong {
      color: var(--color-text);
    }
  `]
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Fallback to clear session locally if API fails
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}

