import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  logout() {
    this.auth.logout();
  }
}
