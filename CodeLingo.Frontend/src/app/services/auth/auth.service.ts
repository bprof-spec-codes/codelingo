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
  private readonly API_URL = 'https://localhost:7107/api/auth';
  private readonly REFRESH_MARGIN = 30; // seconds

  private storage: Storage = localStorage;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.hasValidToken() && this.hasAdminRole());
  isAdmin$ = this.isAdminSubject.asObservable();

  private refreshTimer?: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient, private router: Router) {
    if (sessionStorage.getItem('accessToken')) {
      this.storage = sessionStorage;
    } else {
      this.storage = localStorage;
    }

    const loggedIn = this.hasValidToken();
    this.isLoggedInSubject.next(loggedIn);

    if (loggedIn) {
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
    this.isAdminSubject.next(false);
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
    this.storage = remember ? localStorage : sessionStorage;
  }

  private handleAuthSuccess(response: AuthResponse, updateLogin = true): void {
    const { accessToken, refreshToken, expiresIn, isAdmin } = response;
    const expiryTime = Date.now() + expiresIn * 1000;

    // Clear both storages to prevent conflicts
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('isAdmin');

    this.storage.setItem('accessToken', accessToken);
    if (refreshToken) this.storage.setItem('refreshToken', refreshToken);
    this.storage.setItem('tokenExpiry', expiryTime.toString());
    this.storage.setItem('isAdmin', String(isAdmin));

    if (updateLogin) {
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(isAdmin);
    }
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
    this.isAdminSubject.next(false);

    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('isAdmin');
    clearTimeout(this.refreshTimer);
  }

  getAccessToken(): string | null {
    return (
      localStorage.getItem('accessToken') ??
      sessionStorage.getItem('accessToken')
    );
  }

  private getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  public hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiry = Number(this.storage.getItem('tokenExpiry'));
    return !!token && expiry > Date.now();
  }

  public hasAdminRole(): boolean {
    if (!this.hasValidToken()) return false;
    return this.storage.getItem('isAdmin') === 'true';
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred';
    if (error.error?.error) msg = error.error.error;
    return throwError(() => msg);
  }

  public getUserId(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
  }
}
