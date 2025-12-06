import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access if user is authenticated', () => {
    authServiceSpy.getAccessToken.and.returnValue('dummy-token');

    const result = authGuard({} as any, { url: '/practice/start' } as any);

    expect(result).toBeTrue();
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login and show toast if user is not authenticated', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    const state = { url: '/practice/start' } as any;
    const realUrlTree: UrlTree = router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });

    routerSpy.createUrlTree.and.returnValue(realUrlTree);

    const result = authGuard({} as any, state);

    expect(result).toBe(realUrlTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/practice/start' },
    });
  });
});
