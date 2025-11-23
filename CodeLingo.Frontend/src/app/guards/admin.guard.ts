import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service'; // path-ot igazítsd

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  // 1) nincs token -> login
  if (!token) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const payload = decodeTokenPayload(token);

  // 2) nem sikerül dekódolni -> biztonságból login
  if (!payload) {
    return router.createUrlTree(['/login']);
  }

  // 3) szerepkör(ök) kiolvasása a payloadból
  const roles = extractRoles(payload);
  const isAdmin = roles.some((r) => r.toLowerCase() === 'admin');

  if (!isAdmin) {
    // ha nincs /forbidden routed, cseréld /-ra vagy máshova
    return router.createUrlTree(['/forbidden']);
  }

  // 4) opcionális: exp claim ellenőrzése (lejárt token ne legyen jó)
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // minden OK -> beengedjük az /admin-t
  return true;
};

/** JWT payload dekódolása a token középső részéből */
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

/** roles / role mező normalizálása string tömbbé */
function extractRoles(payload: any): string[] {
  if (!payload) return [];

  // pl. payload.role = "Admin"
  if (typeof payload.role === 'string') {
    return [payload.role];
  }

  // pl. payload.roles = ["Admin", "User"]
  if (Array.isArray(payload.roles)) {
    return payload.roles.map((r: any) => String(r));
  }

  return [];
}