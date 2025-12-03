import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../models/auth';
import { AuthService } from '../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  serverError: string | null = null;
  returnUrl: string = '/landing-page'; // default fallback

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/landing-page';
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

        this.router.navigateByUrl(this.returnUrl);
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

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
}
