import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const formValue = component.form.value;
    expect(formValue.username).toBe('');
    expect(formValue.email).toBe('');
    expect(formValue.password).toBe('');
  });

  it('should mark username as invalid if empty', () => {
    const username = component.username;
    username?.setValue('');
    expect(username?.valid).toBeFalse();
    expect(username?.errors?.['required']).toBeTruthy();
  });

  it('should mark email as invalid if not a valid email', () => {
    const email = component.email;
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalse();
    expect(email?.errors?.['email']).toBeTruthy();
  });

  it('should mark password as invalid if too short', () => {
    const password = component.password;
    password?.setValue('12345');
    expect(password?.valid).toBeFalse();
    expect(password?.errors?.['minlength']).toBeTruthy();
  });

  it('should call authService.register on valid form submit and show success', fakeAsync(() => {
    const registerResponse = {
      message: 'Registration successful',
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
    };
    authServiceSpy.register.and.returnValue(of(registerResponse));

    component.username?.setValue('john');
    component.email?.setValue('john@example.com');
    component.password?.setValue('Password123');

    component.form.updateValueAndValidity(); // force validation
    expect(component.form.valid).toBeTrue();

    component.submit();

    // advance time so subscription runs
    tick();
    expect(component.successMessage).toBe('Registration successful');

    // advance time for setTimeout navigation
    tick(2000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing-page']);
  }));

  it('should set serverError on registration failure', () => {
    const errorResponse = { error: { error: 'Username already exists' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.username?.setValue('john');
    component.email?.setValue('john@example.com');
    component.password?.setValue('Password123');

    component.submit();

    expect(component.isLoading).toBeFalse();
    expect(component.serverError).toBe('Username already exists');
  });

  it('should disable submit button when form is invalid', () => {
    component.username?.setValue('');
    component.email?.setValue('invalid-email');
    component.password?.setValue('123');
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.username?.setValue('john');
    component.email?.setValue('john@example.com');
    component.password?.setValue('Password123');
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeFalse();
  });
});
