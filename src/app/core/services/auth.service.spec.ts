import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and have default unauthenticated state', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should authenticate user on successful login', () => {
    const mockResponse = {
      user: { id: 1, name: 'Test User' },
      authorization: { token: 'fake-jwt-token' }
    };

    service.login({ email: 'test@test.com', password: 'password' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual(mockResponse.user);
    expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
  });

  it('should clear session on logout', () => {
    // Pre-populate
    localStorage.setItem('auth_token', 'fake-jwt');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'T' }));
    
    // Re-initialize to pick up localStorage
    const newService = TestBed.inject(AuthService);
    expect(newService.isAuthenticated()).toBe(true);

    newService.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(newService.isAuthenticated()).toBe(false);
    expect(newService.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
