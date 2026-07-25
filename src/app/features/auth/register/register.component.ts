import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-layout hex-bg">
      <!-- Left: Form -->
      <div class="auth-form-side">
        <div class="auth-form-card card">
          <h1 class="auth-title">INSCRIVEZ VOUS</h1>

          <form class="auth-form" id="register-form" novalidate>
            <!-- Name -->
            <div class="form-group">
              <label for="reg-name" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Name :
              </label>
              <input id="reg-name" name="name" type="text" class="form-input"
                     placeholder="" autocomplete="name" />
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="reg-email" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 7 10-7"/></svg>
                Adresse Email
              </label>
              <input id="reg-email" name="email" type="email" class="form-input"
                     placeholder="" autocomplete="email" />
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="reg-password" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </label>
              <div class="form-input-wrapper">
                <input id="reg-password" name="password" [type]="showPw() ? 'text' : 'password'"
                       class="form-input" placeholder="" autocomplete="new-password" />
                <button type="button" class="toggle-pw" (click)="showPw.set(!showPw())"
                        [attr.aria-label]="showPw() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                  @if (showPw()) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <!-- Currency -->
            <div class="form-group">
              <label for="reg-currency" class="sr-only">Currency</label>
              <select id="reg-currency" name="currency" class="form-select">
                <option value="" disabled selected>Currency</option>
                <option value="XAF">XAF — Franc CFA BEAC</option>
                <option value="USD">USD — Dollar américain</option>
                <option value="EUR">EUR — Euro</option>
                <option value="XOF">XOF — Franc CFA BCEAO</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="auth-actions">
              <a routerLink="/login" class="btn-ghost">Retour</a>
              <button type="submit" class="btn-primary">S'Enregistrer</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right: Hero -->
      <div class="auth-hero-side">
        <img ngSrc="/img/bank-3d-vector.png" alt="Paiement facile et accessible"
             class="auth-hero-img" width="480" height="400" priority />
        <h2 class="auth-hero-title">le paiement facile et accessible</h2>
        <p class="auth-hero-desc">
          Grâce à ces outils, il est possible de payer en ligne, via mobile ou en point de vente,
          sans avoir besoin de manipuler de l'argent liquide. Les solutions de paiement offrent
          également des fonctionnalités avancées telles que le suivi des transactions en temps réel,
          la gestion des factures et l'intégration avec d'autres services numériques.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: calc(100vh - 60px);
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .auth-form-side {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }
    .auth-form-card {
      width: 100%;
      max-width: 440px;
    }
    .auth-title {
      font-size: 1.6rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 2rem;
      text-decoration: underline;
      letter-spacing: 0.02em;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .auth-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1.25rem;
      margin-top: 0.5rem;
    }

    /* Hero side */
    .auth-hero-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 3rem 3rem 1rem;
      text-align: center;
    }
    .auth-hero-img {
      max-width: 100%;
      height: auto;
      margin-bottom: 1.5rem;
    }
    .auth-hero-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .auth-hero-desc {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      max-width: 480px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }
  `]
})
export class RegisterComponent {
  readonly showPw = signal(false);
}
