import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError, delay } from 'rxjs';

interface MockUser {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthMockInterceptor implements HttpInterceptor {
  private users: MockUser[] = [
    { username: 'testuser', email: 'test@example.com', password: '123456' },
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    if (url.endsWith('/auth/register') && method === 'POST') {
      return this.handleRegister(body);
    }
    if (url.endsWith('/auth/login') && method === 'POST') {
      return this.handleLogin(body);
    }
    if (url.endsWith('/auth/token/refresh') && method === 'POST') {
      return this.handleRefresh(body);
    }

    return next.handle(req);
  }

  private handleRegister(body: any): Observable<HttpEvent<any>> {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return throwError(() => ({
        status: 400,
        error: { error: 'Missing required fields' },
      }));
    }
    if (this.users.find((u) => u.username === username)) {
      return throwError(() => ({
        status: 400,
        error: { error: 'Username already exists' },
      }));
    }
    if (this.users.find((u) => u.email === email)) {
      return throwError(() => ({
        status: 400,
        error: { error: 'Email already registered' },
      }));
    }

    const newUser: MockUser = { username, email, password };
    this.users.push(newUser);

    const response = {
      message: 'Registration successful',
      userId: 'user-' + Math.floor(Math.random() * 1000),
      accessToken: this.fakeJwt(),
      refreshToken: this.fakeJwt('refresh'),
      expiresIn: 10, // short expiry to test auto-refresh
    };

    return of(new HttpResponse({ status: 201, body: response })).pipe(
      delay(500)
    );
  }

  private handleLogin(body: any): Observable<HttpEvent<any>> {
    const { usernameOrEmail, password } = body;
    const user = this.users.find(
      (u) =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.password === password
    );

    console.log(usernameOrEmail + ' ' + password);

    if (!user) {
      return throwError(() => ({
        status: 401,
        error: { error: 'Invalid credentials' },
      }));
    }

    const response = {
      accessToken: this.fakeJwt(),
      refreshToken: this.fakeJwt('refresh'),
      expiresIn: 10, // seconds -> for testing
    };

    return of(new HttpResponse({ status: 200, body: response })).pipe(
      delay(400)
    );
  }

  private handleRefresh(body: any): Observable<HttpEvent<any>> {
    const { refreshToken } = body;
    if (!refreshToken || refreshToken.includes('expired')) {
      return throwError(() => ({
        status: 401,
        error: { error: 'Invalid or expired refresh token' },
      }));
    }

    const response = {
      accessToken: this.fakeJwt(),
      expiresIn: 10,
    };

    return of(new HttpResponse({ status: 200, body: response })).pipe(
      delay(300)
    );
  }

  private fakeJwt(type: 'access' | 'refresh' = 'access') {
    return `${type}_token_${Math.random().toString(36).substring(2)}`;
  }
}
