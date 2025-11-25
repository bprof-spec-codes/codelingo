import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  if (!token) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const payload = decodeTokenPayload(token);

  if (!payload) {
    return router.createUrlTree(['/login']);
  }


  const roles = extractRoles(payload);
  const isAdmin = roles.some((r) => r.toLowerCase() === 'admin');

  if (!isAdmin) {
    return router.createUrlTree(['/forbidden']);
  }

  //(lejárt token ne legyen jó)
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return true;
};

function decodeTokenPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractRoles(payload: any): string[] {
  if (!payload) return [];

  if (typeof payload.role === 'string') {
    return [payload.role];
  }

  if (Array.isArray(payload.roles)) {
    return payload.roles.map((r: any) => String(r));
  }

  return [];
}