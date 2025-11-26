import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth/auth.service';
import { AuthResponse } from '../models/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const validAuthResponse = (
    overrides?: Partial<AuthResponse>
  ): AuthResponse => ({
    accessToken: 'fake-access-token',
    expiresIn: 3600,
    refreshToken: 'fake-refresh-token',
    userId: 'user-123',
    message: 'ok',
    isAdmin: false,
    ...overrides,
  });

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setRememberMe',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with controls', () => {
    expect(component.form.contains('username')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
    expect(component.form.contains('rememberMe')).toBeTrue();
  });

  it('username field should be required', () => {
    const username = component.username;
    username?.setValue('');
    expect(username?.invalid).toBeTrue();
  });

  it('password field should be required', () => {
    const password = component.password;
    password?.setValue('');
    expect(password?.invalid).toBeTrue();
  });

  it('should NOT submit if the form is invalid', () => {
    component.form.setValue({
      username: '',
      password: '',
      rememberMe: false,
    });

    component.submit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with correct data when form is valid', () => {
    component.form.setValue({
      username: 'john',
      password: '123456',
      rememberMe: true,
    });

    authServiceSpy.login.and.returnValue(of(validAuthResponse()));

    component.submit();

    expect(authServiceSpy.setRememberMe).toHaveBeenCalledWith(true);
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'john',
      password: '123456',
    });
  });

  it('should navigate on successful login', () => {
    component.form.setValue({
      username: 'john',
      password: '123456',
      rememberMe: false,
    });

    // return a valid AuthResponse
    authServiceSpy.login.and.returnValue(
      of(validAuthResponse({ message: 'Logged in' }))
    );

    component.submit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lading-page']);
  });

  it('should set serverError on login error (non-string error)', () => {
    component.form.setValue({
      username: 'john',
      password: 'badpass',
      rememberMe: false,
    });

    // simulate an error object (not a string)
    authServiceSpy.login.and.returnValue(
      throwError(() => ({ message: 'Invalid credentials' }))
    );

    component.submit();

    expect(component.serverError).toBe(
      'Invalid credentials or server error. Please try again.'
    );
  });

  it('should set serverError on login error (string error)', () => {
    component.form.setValue({
      username: 'john',
      password: 'badpass',
      rememberMe: false,
    });

    // simulate a string error path
    authServiceSpy.login.and.returnValue(throwError(() => 'A string error'));

    component.submit();

    expect(component.serverError).toBe('A string error');
  });

  it('should stop loading on error', () => {
    component.form.setValue({
      username: 'john',
      password: 'badpass',
      rememberMe: false,
    });

    authServiceSpy.login.and.returnValue(
      throwError(() => ({ message: 'error' }))
    );

    component.submit();

    expect(component.isLoading).toBeFalse();
  });

  it('should stop loading on success', () => {
    component.form.setValue({
      username: 'john',
      password: '123456',
      rememberMe: false,
    });

    authServiceSpy.login.and.returnValue(of(validAuthResponse()));

    component.submit();

    expect(component.isLoading).toBeFalse();
  });
});
