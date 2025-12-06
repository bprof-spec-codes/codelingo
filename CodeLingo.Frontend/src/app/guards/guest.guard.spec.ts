import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth/auth.service';

describe('guestGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAccessToken']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => {
      return guestGuard({} as any, {} as any); 
    });

  it('should return true (allow activation) if the user is NOT authenticated (guest)', () => {
    // Arrange
    mockAuthService.getAccessToken.and.returnValue(null);

    // Act
    const result = runGuard();

    // Assert
    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to the home page (UrlTree) if the user IS authenticated', () => {
    // Arrange
    mockAuthService.getAccessToken.and.returnValue('valid-jwt-token');

    // Mock the Router
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.and.returnValue(expectedUrlTree);

    // Act
    const result = runGuard();

    // Assert
    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('should return true if getAccessToken returns an empty string', () => {
    mockAuthService.getAccessToken.and.returnValue('');

    const result = runGuard();

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });
});