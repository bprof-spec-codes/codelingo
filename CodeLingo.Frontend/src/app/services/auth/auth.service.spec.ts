import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/auth';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockResponse: AuthResponse = {
    accessToken: 'test-access',
    refreshToken: 'test-refresh',
    expiresIn: 3600,
    message: 'ok',
    userId: '123',
  };

  // ---------------- Mock Storage -----------------
  class MockStorage {
    private store: Record<string, string> = {};
    getItem(key: string) {
      return this.store[key] || null;
    }
    setItem(key: string, value: string) {
      this.store[key] = value;
    }
    removeItem(key: string) {
      delete this.store[key];
    }
    clear() {
      this.store = {};
    }
  }
  let mockStorage: MockStorage;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockStorage = new MockStorage();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // override storage
    (service as any).storage = mockStorage;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // -------------------------------------------------------------------------------------------
  it('should login and store tokens', () => {
    const body: LoginRequest = { usernameOrEmail: 'john', password: '123' };

    service.login(body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.usernameOrEmail).toBe('john');

    req.flush(mockResponse);

    expect(mockStorage.getItem('accessToken')).toBe('test-access');
  });

  // -------------------------------------------------------------------------------------------
  it('should register and store tokens', () => {
    const body: RegisterRequest = {
      username: 'john',
      email: 'test@test.com',
      password: '123',
    };

    service.register(body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/register');
    expect(req.request.method).toBe('POST');

    // Check body
    expect(req.request.body.username).toBe('john');
    expect(req.request.body.email).toBe('test@test.com');
    expect(req.request.body.password).toBe('123');

    // Mock response
    req.flush(mockResponse);

    expect(mockStorage.getItem('accessToken')).toBe('test-access');
    expect(mockStorage.getItem('refreshToken')).toBe('test-refresh');
  });

  // -------------------------------------------------------------------------------------------
  it('should update isLoggedIn$ to true on login', (done) => {
    const body: LoginRequest = { usernameOrEmail: 'john', password: '123' };

    service.isLoggedIn$.subscribe((val) => {
      if (val === true) {
        expect(val).toBeTrue();
        done();
      }
    });

    service.login(body).subscribe();

    const req = httpMock.expectOne('/auth/login');
    req.flush(mockResponse);
  });

  // -------------------------------------------------------------------------------------------
  it('should logout, clear tokens, and navigate to login', () => {
    mockStorage.setItem('accessToken', 'abc');
    mockStorage.setItem('tokenExpiry', (Date.now() + 5000).toString());

    service.logout();

    expect(mockStorage.getItem('accessToken')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  // -------------------------------------------------------------------------------------------
  it('should return null from refreshToken when no refresh token exists', (done) => {
    service.refreshToken().subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  // -------------------------------------------------------------------------------------------
  it('should call refresh token endpoint when refresh token exists', () => {
    mockStorage.setItem('refreshToken', 'my-refresh');
    mockStorage.setItem('tokenExpiry', (Date.now() + 5000).toString());

    service.refreshToken().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/token/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.refreshToken).toBe('my-refresh');

    req.flush(mockResponse);
  });

  // -------------------------------------------------------------------------------------------
  it('should autoLogout when refresh fails', () => {
    mockStorage.setItem('refreshToken', 'abc');
    mockStorage.setItem('tokenExpiry', (Date.now() + 5000).toString());

    service.refreshToken().subscribe((result) => {
      expect(result).toBeNull();
      expect(mockStorage.getItem('accessToken')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    const req = httpMock.expectOne('/auth/token/refresh');
    req.error(new ProgressEvent('fail'));
  });

  // -------------------------------------------------------------------------------------------
  it('should schedule token refresh', fakeAsync(() => {
    const expiresIn = 5; // seconds
    const expiryTime = Date.now() + expiresIn * 1000;

    mockStorage.setItem('accessToken', 'abc');
    mockStorage.setItem('tokenExpiry', expiryTime.toString());

    const refreshSpy = spyOn(service, 'refreshToken').and.returnValue(
      new BehaviorSubject(null)
    );

    (service as any).scheduleTokenRefresh();

    tick(expiresIn * 1000);

    expect(refreshSpy).toHaveBeenCalled();
  }));

  // -------------------------------------------------------------------------------------------
  it('should handle error and return message string', () => {
    let errorMsg = '';

    service.login({ usernameOrEmail: 'john', password: '123' }).subscribe({
      error: (err) => (errorMsg = err),
    });

    const req = httpMock.expectOne('/auth/login');
    req.flush(
      { error: 'Invalid username or password' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(errorMsg).toBe('Invalid username or password');
  });
});
