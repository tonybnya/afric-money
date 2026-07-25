import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { environment } from '../../../environments/environment';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user details', () => {
    service.getUserDetails().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush({ user: { id: 1, name: 'Test' } });
  });

  it('should credit account', () => {
    service.creditAccount(100).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/account/credit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 100 });
    req.flush({ success: true });
  });

  it('should debit account', () => {
    service.debitAccount(50).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/account/debit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 50 });
    req.flush({ success: true });
  });
});
