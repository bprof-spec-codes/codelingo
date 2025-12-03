import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RegisterRequest } from '../models/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: FormGroup;
  isLoading = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  showRegisterPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.serverError = null;
    this.isLoading = true;

    const { username, email, password } = this.form.value;

    const registerData: RegisterRequest = {
      username,
      email,
      password,
    };

    this.authService.register(registerData).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.isLoading = false;

        this.successMessage = res.message || 'Registration successful!';

        setTimeout(() => {
          this.router.navigate(['/landing-page']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.isLoading = false;

        // user-friendly error message
        if (err.error?.error) {
          this.serverError = err.error.error;
        } else {
          this.serverError = 'Something went wrong. Please try again.';
        }
      },
    });
  }

  toggleRegisterPasswordVisibility() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  get username() {
    return this.form.get('username');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
}
