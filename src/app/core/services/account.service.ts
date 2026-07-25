import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://recruitment.africremit.ca/api';

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.API_URL}/user`);
  }

  creditAccount(amount: number): Observable<any> {
    return this.http.post(`${this.API_URL}/account/credit`, { amount });
  }

  debitAccount(amount: number): Observable<any> {
    return this.http.post(`${this.API_URL}/account/debit`, { amount });
  }
}
