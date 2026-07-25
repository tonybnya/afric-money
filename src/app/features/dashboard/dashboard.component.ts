import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';

interface Transaction {
  date: string;
  service: string;
  direction: 'CREDIT' | 'DEBIT';
  fees: number;
  name: string;
  amountReceived: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  currency: string;
}

const MOCK_TX: Transaction[] = [
  { date: '27 / 02 / 2025', service: 'Dépôt Orange - CM', direction: 'CREDIT', fees: 0, name: 'NGALE Brenda', amountReceived: 500, balanceBefore: 526529.42, balanceAfter: 526029.42, status: 'PENDING', currency: 'USD' },
  { date: '27 / 11 / 2024', service: 'Dépôt Orange - CM', direction: 'DEBIT', fees: 0, name: 'DENDA Erick', amountReceived: 500, balanceBefore: 527029.42, balanceAfter: 526529.42, status: 'SUCCESS', currency: 'USD' },
  { date: '22 / 10 / 2025', service: 'Dépôt Orange - CM', direction: 'CREDIT', fees: 0, name: 'FOTSO Ramsses', amountReceived: 500, balanceBefore: 527529.42, balanceAfter: 526529.42, status: 'PENDING', currency: 'USD' },
  { date: '15 / 10 / 2024', service: 'Envoi Agence - CM', direction: 'DEBIT', fees: 0, name: 'ENDALE Stivy', amountReceived: 500, balanceBefore: 528029.42, balanceAfter: 527529.42, status: 'FAILED', currency: 'USD' },
  { date: '23 / 09 / 2024', service: 'Envoi', direction: 'CREDIT', fees: 0, name: 'RENDEH Rebecca', amountReceived: 500, balanceBefore: 528029.42, balanceAfter: 528029.42, status: 'PENDING', currency: 'USD' },
];

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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
              </div>
              <span>Send<br>Money</span>
            </button>
            <button type="button" class="quick-action" id="btn-add" (click)="openAdd()">
              <div class="quick-action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 12h-4m0 0H8m4 0V9m0 3v3"/></svg>
              </div>
              <span>Add<br>Money</span>
            </button>
            <button type="button" class="quick-action" id="btn-history">
              <div class="quick-action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span>History</span>
            </button>
            <button type="button" class="quick-action" id="btn-more">
              <div class="quick-action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
                  <th scope="col">Services</th>
                  <th scope="col">In (+) / Out (-)</th>
                  <th scope="col">Fees</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Amount received</th>
                  <th scope="col">Balance Before</th>
                  <th scope="col">Balance After</th>
                  <th scope="col">Statut</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of transactions(); track tx.date + tx.name) {
                  <tr>
                    <td>{{ tx.date }}</td>
                    <td>{{ tx.service }}</td>
                    <td [class]="tx.direction === 'CREDIT' ? 'credit' : 'debit'">
                      {{ tx.direction === 'CREDIT' ? '+' : '-' }}{{ tx.amountReceived.toFixed(2) }} {{ tx.currency }}
                    </td>
                    <td>{{ tx.fees.toFixed(2) }} {{ tx.currency }}</td>
                    <td><strong>{{ tx.name }}</strong></td>
                    <td>{{ tx.amountReceived.toFixed(2) }} {{ tx.currency }}</td>
                    <td>{{ tx.balanceBefore.toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} {{ tx.currency }}</td>
                    <td>{{ tx.balanceAfter.toLocaleString('fr-FR', {minimumFractionDigits: 2}) }} {{ tx.currency }}</td>
                    <td>
                      <span [class]="statusClass(tx.status)">{{ tx.status }}</span>
                    </td>
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
  
  readonly transactions = signal<Transaction[]>(MOCK_TX);

  // Modals state
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
        // Handle varying response envelopes safely
        const user = res?.user || res?.data || res;
        const account = user?.account || res?.account;

        if (user?.name) this.userName.set(user.name);
        if (user?.currency) this.currency.set(user.currency);
        
        if (account) {
          this.balance.set(account.balance ?? 0);
          this.accountNumber.set(account.accountNumber ?? this.accountNumber());
          // If the API returns a journal/transactions list, we'd assign it here.
          // Otherwise, keeping our MOCK_TX for the design completeness.
          if (account.accounting_journal && Array.isArray(account.accounting_journal)) {
            // this.transactions.set(account.accounting_journal);
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

  statusClass(status: string): string {
    const map: Record<string, string> = {
      SUCCESS: 'badge badge--success',
      FAILED: 'badge badge--danger',
      PENDING: 'badge badge--pending',
    };
    return map[status] ?? 'badge';
  }

  closeOnBackdrop(event: MouseEvent, modal: 'add' | 'send'): void {
    if (event.target === event.currentTarget) {
      modal === 'add' ? this.showAdd.set(false) : this.showSend.set(false);
    }
  }
}
