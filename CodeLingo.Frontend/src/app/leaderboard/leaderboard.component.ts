import { Component, OnInit } from '@angular/core';
import { LanguageService, Language } from '../services/language.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { LeaderboardDto } from '../models/leaderboard';

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardDto | null = null;
  languages: Language[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  selectedLanguage: string | undefined;
  selectedDifficulty: string | undefined;

  constructor(
    private leaderboardService: LeaderboardService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.loadLanguages();
    this.loadLeaderboard();
  }

  loadLanguages(): void {
    this.languageService.getLanguages().subscribe({
      next: (languages) => {
        this.languages = languages;
      },
      error: (err) => {
        console.error('Error loading languages:', err);
      }
    });
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.error = null;

    this.leaderboardService.getLeaderboard(
      this.currentPage,
      this.pageSize,
      this.selectedLanguage,
      this.selectedDifficulty
    ).subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        this.error = 'Failed to load leaderboard. Please try again later.';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLeaderboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadLeaderboard();
  }

  getRankBadgeClass(rank: number): string {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-default';
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return 'bi-trophy-fill';
    if (rank === 2) return 'bi-award-fill';
    if (rank === 3) return 'bi-award-fill';
    return '';
  }

  get pages(): number[] {
    if (!this.leaderboard) return [];
    const totalPages = this.leaderboard.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  }
}