import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest, AuthResponse, LoginRequest } from '../../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = '/auth';
  private readonly REFRESH_MARGIN = 30; // seconds

  private storage: Storage = localStorage;

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private refreshTimer?: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient, private router: Router) {
    if (this.hasValidToken()) {
      this.scheduleTokenRefresh();
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError(this.handleError)
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuthData();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.autoLogout();
      return of(null);
    }

    return this.http
      .post<AuthResponse>(`${this.API_URL}/token/refresh`, { refreshToken })
      .pipe(
        tap((res) => this.handleAuthSuccess(res, false)),
        catchError(() => {
          this.autoLogout();
          return of(null);
        })
      );
  }

  setRememberMe(remember: boolean): void {
    this.storage = remember ? this.storage : sessionStorage;
  }

  private handleAuthSuccess(response: AuthResponse, updateLogin = true): void {
    const { accessToken, refreshToken, expiresIn } = response;
    const expiryTime = Date.now() + expiresIn * 1000;

    this.storage.setItem('accessToken', accessToken);
    if (refreshToken) this.storage.setItem('refreshToken', refreshToken);
    this.storage.setItem('tokenExpiry', expiryTime.toString());

    if (updateLogin) this.isLoggedInSubject.next(true);
    this.scheduleTokenRefresh();
  }

  private scheduleTokenRefresh(): void {
    const expiry = Number(this.storage.getItem('tokenExpiry'));
    if (!expiry) return;

    const delay = Math.max(expiry - Date.now() - this.REFRESH_MARGIN * 1000, 0);
    clearTimeout(this.refreshTimer);

    this.refreshTimer = setTimeout(() => {
      const stillValid = expiry > Date.now();
      if (!stillValid) {
        this.autoLogout();
      } else {
        this.refreshToken().subscribe();
      }
    }, delay);
  }

  private autoLogout(redirect: boolean = true): void {
    this.clearAuthData();
    this.isLoggedInSubject.next(false);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  private clearAuthData(): void {
    this.storage.removeItem('accessToken');
    this.storage.removeItem('refreshToken');
    this.storage.removeItem('tokenExpiry');
    clearTimeout(this.refreshTimer);
  }

  getAccessToken(): string | null {
    return this.storage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiry = Number(this.storage.getItem('tokenExpiry'));
    return !!token && expiry > Date.now();
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred';
    if (error.error?.error) msg = error.error.error;
    return throwError(() => msg);
  }
}
