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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { usernameOrEmail, password } = this.form.value;

    const loginData: LoginRequest = {
      usernameOrEmail,
      password,
    };

    this.isLoading = true;
    this.authService.login(loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.isLoading = false;

        this.router.navigate(['/lading-page']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
      },
    });
  }
}
