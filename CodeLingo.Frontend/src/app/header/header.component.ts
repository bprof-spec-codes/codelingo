import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ProfileService } from '../services/profile.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  profilePictureUrl$!: Observable<string | null>;
  isMobileMenuOpen = false;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.isAdmin$ = this.auth.isAdmin$;

    // Fetch profile picture when user is logged in
    this.profilePictureUrl$ = this.isLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.profileService.getProfile().pipe(
            map(user => user.profilePictureUrl || null),
            catchError(() => of(null))
          );
        }
        return of(null);
      })
    );
  }

  logout() {
    this.auth.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
