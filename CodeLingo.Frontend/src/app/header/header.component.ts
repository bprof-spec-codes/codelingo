import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ProfileService } from '../services/profile.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, delay, retry, startWith } from 'rxjs/operators';
import { UserStatsService } from '../services/user-stats.service';

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
  userLevel$!: Observable<number | null>;
  isMobileMenuOpen = false;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private userStatsService: UserStatsService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.isAdmin$ = this.auth.isAdmin$;

    // Fetch profile picture when user is logged in
    this.profilePictureUrl$ = this.isLoggedIn$.pipe(
      delay(0),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.profileService.profileUpdated$.pipe(
            startWith(null),
            switchMap(() => this.profileService.getProfile().pipe(
              map(user => user.profilePictureUrl || null),
              retry(1),
              catchError(() => of(null))
            ))
          );
        }
        return of(null);
      })
    );
    this.userLevel$ = this.isLoggedIn$.pipe(
      delay(0),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.userStatsService.getUserStats().pipe(
            map(stats => this.calculateLevel(stats.totalScore)),
            retry(1),
            catchError(() => of(null))
          );
        }
        return of(null);
      })
    );
  }

  private calculateLevel(totalXP: number): number {
    let level = 1;
    let xpMax = 99;

    // Calculate current level based on XP formula
    // Level 1: 0-99 XP
    // Level 2: 100-299 XP (100 + 200)
    // Level 3: 300-599 XP (300 + 300)
    // Level n: previous max + (n * 100)
    while (totalXP > xpMax) {
      level++;
      const xpMin = xpMax + 1;
      xpMax = xpMin + (level * 100) - 1;
    }

    return level;
  }

  logout() {
    this.auth.logout();
  }

  handlePracticeClick(event: Event) {
    if (!this.auth.hasValidToken()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
