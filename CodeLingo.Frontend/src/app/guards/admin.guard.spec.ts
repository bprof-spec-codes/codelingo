import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { runInInjectionContext } from '@angular/core';

import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth/auth.service';

describe('adminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  function runGuard(url: string = '/admin') {
    const route: any = {} as any;
    const state: RouterStateSnapshot = { url } as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => adminGuard(route, state));
  }

  function createToken(payload: any): string {
    const json = JSON.stringify(payload);
    const base64 = btoa(json)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `header.${base64}.signature`;
  }

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getAccessToken'
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    });

    router = TestBed.inject(Router);
  });

  it('should redirect to /login when there is no token', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    const result = runGuard('/admin');

    expect(result instanceof UrlTree).toBeTrue();
    const url = router.serializeUrl(result as UrlTree);
    expect(url).toBe('/login?returnUrl=%2Fadmin');
  });

  it('should redirect to /login when token payload cannot be decoded', () => {

    authServiceSpy.getAccessToken.and.returnValue('invalid-token');

    const result = runGuard('/admin');

    expect(result instanceof UrlTree).toBeTrue();
    const url = router.serializeUrl(result as UrlTree);
    expect(url).toBe('/login');
  });

  it('should redirect to /forbidden when user is not admin', () => {
    const payload = {
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const token = createToken(payload);
    authServiceSpy.getAccessToken.and.returnValue(token);

    const result = runGuard('/admin');

    expect(result instanceof UrlTree).toBeTrue();
    const url = router.serializeUrl(result as UrlTree);
    expect(url).toBe('/forbidden');
  });

  it('should redirect to /login when token is expired', () => {
    const payload = {
      roles: ['admin'],
      exp: Math.floor(Date.now() / 1000) - 10
    };
    const token = createToken(payload);
    authServiceSpy.getAccessToken.and.returnValue(token);

    const result = runGuard('/admin');

    expect(result instanceof UrlTree).toBeTrue();
    const url = router.serializeUrl(result as UrlTree);
    expect(url).toBe('/login?returnUrl=%2Fadmin');
  });

  it('should allow activation when user is admin and token is valid', () => {
    const payload = {
      roles: ['admin', 'user'],
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const token = createToken(payload);
    authServiceSpy.getAccessToken.and.returnValue(token);

    const result = runGuard('/admin');

    expect(result).toBeTrue();
  });
});