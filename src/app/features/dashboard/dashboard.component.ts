import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';

interface JournalEntry {
  id: number;
  accountId: number;
  direction: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

interface Transaction {
  id: number;
  date: string;
  direction: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-page">
      <div class="container">

        <!-- Welcome heading -->
        <h1 class="welcome-heading">
          Welcome Dear <span class="accent">{{ userName() }}!</span>
        </h1>

        <!-- Top row: cards + quick actions -->
        <div class="top-row">

          <!-- Active account card -->
          <div class="account-card account-card--active" role="region" aria-label="Compte actif">
            <div class="card-header">
              <span class="card-label">COMPTE &#64;FRIC MONEY</span>
              <span class="commission">COMMISSION <br><strong>0.00 <svg width="10" height="10" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></strong></span>
            </div>
            <div class="card-balance">
              <button type="button" class="eye-btn" aria-label="Afficher/masquer le solde" (click)="balanceVisible.set(!balanceVisible())">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  @if (balanceVisible()) {
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  } @else {
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                  }
                </svg>
              </button>
              <span class="flag">🇨🇲</span>
              <span class="balance-amount">
                @if (balanceVisible()) { {{ balance().toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} } @else { *** }
              </span>
              <span class="balance-currency">{{ currency() }}</span>
            </div>
            <p class="card-account-number">{{ accountNumber() }}</p>
          </div>

          <!-- Ghost account card -->
          <div class="account-card account-card--ghost" role="region" aria-label="Compte secondaire">
            <div class="card-header">
              <span class="card-label ghost-label">COMPTE &#64;FRIC MONEY</span>
              <span class="commission ghost-commission">COMMISSION <br><strong>0.00 <svg width="10" height="10" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></strong></span>
            </div>
            <div class="card-balance ghost-balance">
              <button type="button" class="eye-btn ghost-eye" aria-label="Afficher/masquer le solde secondaire">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <span class="flag">🇨🇲</span>
              <span class="balance-amount ghost-amount">5 000 000</span>
              <span class="balance-currency ghost-currency">XAF</span>
            </div>
            <p class="card-account-number ghost-number">+237 690 20 20 20</p>
          </div>

          <!-- Quick actions -->
          <div class="quick-actions" role="group" aria-label="Actions rapides">
            <button type="button" class="quick-action" id="btn-send" (click)="openSend()">
              <div class="quick-action-icon">
                <img src="/icons/Send-money.png" alt="" width="24" height="24" class="quick-action-img" />
              </div>
              <span>Send<br>Money</span>
            </button>
            <button type="button" class="quick-action" id="btn-add" (click)="openAdd()">
              <div class="quick-action-icon">
                <img src="/icons/portefeuille.png" alt="" width="24" height="24" class="quick-action-img" />
              </div>
              <span>Add<br>Money</span>
            </button>
            <button type="button" class="quick-action" id="btn-history">
              <div class="quick-action-icon">
                <img src="/icons/history.png" alt="" width="24" height="24" class="quick-action-img" />
              </div>
              <span>History</span>
            </button>
            <button type="button" class="quick-action" id="btn-more">
              <div class="quick-action-icon">
                <img src="/icons/plus.png" alt="" width="24" height="24" class="quick-action-img" />
              </div>
              <span>More</span>
            </button>
          </div>

        </div><!-- /top-row -->

        <!-- Transactions table -->
        <section class="transactions-section" aria-labelledby="tx-heading">
          <div class="transactions-header">
            <h2 id="tx-heading" class="tx-title">5 DERNIÈRES TRANSACTIONS</h2>
            <a href="#" class="tx-voir">VOIR +</a>
          </div>

          <div class="table-wrapper">
            <table class="data-table" aria-label="Dernières transactions">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Direction</th>
                  <th scope="col">Montant</th>
                  <th scope="col">Solde avant</th>
                  <th scope="col">Solde après</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of transactions(); track tx.id) {
                  <tr>
                    <td>{{ tx.date }}</td>
                    <td [class]="tx.direction === 'CREDIT' ? 'credit' : 'debit'">
                      {{ tx.direction === 'CREDIT' ? 'Dépôt' : 'Retrait' }}
                    </td>
                    <td [class]="tx.direction === 'CREDIT' ? 'credit' : 'debit'">
                      {{ tx.direction === 'CREDIT' ? '+' : '-' }}{{ tx.amount.toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} {{ tx.currency }}
                    </td>
                    <td>{{ tx.balanceBefore.toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} {{ tx.currency }}</td>
                    <td>{{ tx.balanceAfter.toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} {{ tx.currency }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

      </div><!-- /container -->

      <!-- Add Money Modal -->
      @if (showAdd()) {
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-title"
             (click)="closeOnBackdrop($event, 'add')">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <h2 id="add-title">Add Money</h2>
            @if (addError()) { <div class="alert alert--error">{{ addError() }}</div> }
            <div class="form-group">
              <label for="add-amount" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Amont :
              </label>
              <input id="add-amount" type="number" min="1" class="form-input" [formControl]="addAmountCtrl" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" (click)="showAdd.set(false)" [disabled]="isSubmitting()">Retour</button>
              <button type="button" class="btn-primary" (click)="submitAdd()" [disabled]="addAmountCtrl.invalid || isSubmitting()">
                {{ isSubmitting() ? 'En cours...' : 'Valider' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Send Money Modal -->
      @if (showSend()) {
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="send-title"
             (click)="closeOnBackdrop($event, 'send')">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <h2 id="send-title">Send Money</h2>
            @if (sendError()) { <div class="alert alert--error">{{ sendError() }}</div> }
            <div class="form-group">
              <label for="send-amount" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Amont :
              </label>
              <input id="send-amount" type="number" min="1" class="form-input" [formControl]="sendAmountCtrl" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" (click)="showSend.set(false)" [disabled]="isSubmitting()">Retour</button>
              <button type="button" class="btn-primary" (click)="submitSend()" [disabled]="sendAmountCtrl.invalid || isSubmitting()">
                {{ isSubmitting() ? 'En cours...' : 'Valider' }}
              </button>
            </div>
          </div>
        </div>
      }

    </div><!-- /dashboard-page -->
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem 0 4rem;
    }
    .welcome-heading {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
    }
    .accent { color: var(--color-primary); }

    /* Top row */
    .top-row {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    /* Account card internals */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .card-label { opacity: 0.9; }
    .commission { text-align: right; font-size: 0.68rem; }

    .card-balance {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .eye-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.8;
      padding: 0;
      display: flex;
      align-items: center;
      transition: opacity 0.15s;
    }
    .eye-btn:hover { opacity: 1; }
    .flag { font-size: 1.4rem; }
    .balance-amount {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .balance-currency { font-size: 1rem; font-weight: 600; }

    .card-account-number {
      font-size: 0.82rem;
      opacity: 0.75;
    }

    /* Ghost card overrides */
    .ghost-label, .ghost-commission, .ghost-eye { color: var(--color-text-muted); }
    .ghost-amount { color: var(--color-text); }
    .ghost-currency { color: var(--color-text-muted); }
    .ghost-number { color: var(--color-text-muted); }

    /* Quick actions */
    .quick-actions {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      padding-top: 0.5rem;
      margin-left: auto;
    }

    /* Transactions */
    .transactions-section { margin-top: 1rem; }
    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .tx-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .tx-voir {
      color: var(--color-primary);
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: underline;
    }
    .table-wrapper {
      overflow-x: auto;
      background: var(--color-white);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
    }

    /* Modal actions */
    .modal-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1.25rem;
      margin-top: 1.75rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly accountService = inject(AccountService);

  readonly balanceVisible = signal(true);
  readonly showAdd = signal(false);
  readonly showSend = signal(false);

  readonly userName = signal('');
  readonly balance = signal(0);
  readonly currency = signal('XAF');
  readonly accountNumber = signal('+237 000 00 00 00');
  
  readonly transactions = signal<Transaction[]>([]);

  readonly isSubmitting = signal(false);
  readonly addError = signal('');
  readonly sendError = signal('');

  addAmountCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);
  sendAmountCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.accountService.getUserDetails().subscribe({
      next: (res: any) => {
        const user = res?.user || res?.data || res;
        const account = user?.account || res?.account;
        const cur = user?.currency || account?.currency || 'XAF';

        if (user?.name) this.userName.set(user.name);
        if (cur) this.currency.set(cur);

        if (account) {
          this.balance.set(account.balance ?? 0);
          this.accountNumber.set(account.accountNumber ?? this.accountNumber());

          if (account.accounting_journal && Array.isArray(account.accounting_journal)) {
            const entries: Transaction[] = account.accounting_journal.map((j: JournalEntry) => ({
              id: j.id,
              date: formatDate(j.createdAt),
              direction: j.direction,
              amount: j.amount,
              balanceBefore: j.balanceBefore,
              balanceAfter: j.balanceAfter,
              currency: cur,
            }));
            this.transactions.set(entries);
          }
        }
      },
      error: (err) => console.error('Failed to load user details', err)
    });
  }

  openAdd() {
    this.addAmountCtrl.reset();
    this.addError.set('');
    this.showAdd.set(true);
  }

  submitAdd() {
    if (this.addAmountCtrl.invalid) return;
    this.isSubmitting.set(true);
    this.addError.set('');

    this.accountService.creditAccount(this.addAmountCtrl.value!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showAdd.set(false);
        this.fetchData(); // Refresh balance
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.addError.set(err.error?.message || 'Erreur lors du dépôt');
      }
    });
  }

  openSend() {
    this.sendAmountCtrl.reset();
    this.sendError.set('');
    this.showSend.set(true);
  }

  submitSend() {
    if (this.sendAmountCtrl.invalid) return;
    this.isSubmitting.set(true);
    this.sendError.set('');

    this.accountService.debitAccount(this.sendAmountCtrl.value!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSend.set(false);
        this.fetchData(); // Refresh balance
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.sendError.set(err.error?.message || 'Erreur lors de l’envoi');
      }
    });
  }

  closeOnBackdrop(event: MouseEvent, modal: 'add' | 'send'): void {
    if (event.target === event.currentTarget) {
      modal === 'add' ? this.showAdd.set(false) : this.showSend.set(false);
    }
  }
}
