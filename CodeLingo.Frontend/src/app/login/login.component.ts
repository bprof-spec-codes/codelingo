import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../models/auth';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  isLoading = false;
  serverError: string | null = null;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z]).+$/), // at least one uppercase
        ],
      ],
      rememberMe: [false],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.serverError = null;
    const { username, password, rememberMe } = this.form.value;

    this.authService.setRememberMe(rememberMe);

    const loginData: LoginRequest = {
      username: username,
      password,
    };

    this.isLoading = true;
    this.authService.login(loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.isLoading = false;

        this.router.navigate(['/landing-page']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;

        this.serverError =
          typeof err === 'string'
            ? err
            : 'Invalid credentials or server error. Please try again.';
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
}
