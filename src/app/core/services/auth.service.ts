import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly API_URL = 'https://recruitment.africremit.ca/api';

  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {
    if (this.isBrowser) {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken) {
        this.token.set(storedToken);
      }
      if (storedUser) {
        try {
          this.currentUser.set(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user from local storage', e);
        }
      }
    }
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, payload);
  }

  login(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, payload).pipe(
      tap((res) => {
        this.setSession(res.authorization.token, res.user);
      })
    );
  }

  logout(): Observable<any> {
    // According to Postman, logout is a POST request
    return this.http.post(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  private setSession(token: string, user: User) {
    this.token.set(token);
    this.currentUser.set(user);
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  clearSession() {
    this.token.set(null);
    this.currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }
}
