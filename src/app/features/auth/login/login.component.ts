import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgOptimizedImage, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-layout hex-bg">
      <div class="auth-form-side">
        <div class="auth-form-card card">
          <h1 class="auth-title">CONNECTEZ-VOUS</h1>

          @if (errorMsg()) {
            <div class="alert alert--error" role="alert">{{ errorMsg() }}</div>
          }

          <form [formGroup]="form" class="auth-form" (ngSubmit)="onSubmit()" novalidate>
            <!-- Email -->
            <div class="form-group">
              <label for="login-email" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 7 10-7"/></svg>
                Adresse Email
              </label>
              <input formControlName="email" id="login-email" type="email" class="form-input" autocomplete="email" />
              @if (fieldError('email')) { <span class="field-error">{{ fieldError('email') }}</span> }
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="login-password" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Mot de passe
              </label>
              <div class="form-input-wrapper">
                <input formControlName="password" id="login-password" [type]="showPw() ? 'text' : 'password'"
                       class="form-input" autocomplete="current-password" />
                <button type="button" class="toggle-pw" (click)="showPw.set(!showPw())"
                        [attr.aria-label]="showPw() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                  @if (showPw()) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              @if (fieldError('password')) { <span class="field-error">{{ fieldError('password') }}</span> }
            </div>

            <!-- Actions -->
            <div class="auth-actions">
              <a routerLink="/register" class="btn-ghost">S'Inscrire</a>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || loading()">
                {{ loading() ? 'Chargement...' : 'Valider' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="auth-hero-side">
        <img ngSrc="/img/bank-3d-vector.png" alt="Paiement facile et accessible"
             class="auth-hero-img" width="480" height="400" priority />
        <h2 class="auth-hero-title">Le paiement facile et accessible</h2>
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
      justify-content: center;
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
    .field-error {
      display: block;
      font-size: 0.78rem;
      color: #e74c3c;
      margin-top: 0.25rem;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly showPw = signal(false);
  readonly loading = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  fieldError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.errors || !ctrl.touched) return '';
    if (ctrl.errors['required']) return 'Ce champ est requis.';
    if (ctrl.errors['email']) return 'Adresse email invalide.';
    return '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Identifiants incorrects.');
      }
    });
  }
}

