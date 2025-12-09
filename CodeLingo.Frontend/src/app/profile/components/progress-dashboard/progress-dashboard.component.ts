import { Component, OnInit } from '@angular/core';
import { UserStatsService } from '../../../services/user-stats.service';
import { UserStats, UserStatistics } from '../../../models/user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-progress-dashboard',
  standalone: false,
  templateUrl: './progress-dashboard.component.html',
  styleUrl: './progress-dashboard.component.scss'
})
export class ProgressDashboardComponent implements OnInit {
  userStats: UserStats | null = null;
  userStatistics: UserStatistics | null = null;
  loading = true;
  error: string | null = null;
  activeTab: 'overview' | 'history' | 'languages' | 'difficulty' | 'time' = 'overview';

  // Level calculation properties
  currentLevel: number = 1;
  currentLevelMinXP: number = 0;
  nextLevelMinXP: number = 100;
  progressPercentage: number = 0;

  constructor(private userStatsService: UserStatsService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  loadUserStats(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      stats: this.userStatsService.getUserStats(),
      statistics: this.userStatsService.getStatistics()
    }).subscribe({
      next: (result) => {
        this.userStats = result.stats;
        this.userStatistics = result.statistics;
        if (result.stats) {
          this.calculateLevel(result.stats.totalScore);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
        this.error = err.status === 404 
          ? 'No statistics available yet. Complete some practice sessions to see your progress!' 
          : 'Failed to load statistics. Please try again later.';
        this.loading = false;
      }
    });
  }

  calculateLevel(totalXP: number): void {
    let level = 1;
    let xpMin = 0;
    let xpMax = 99;

    // Calculate current level
    while (totalXP > xpMax) {
      level++;
      xpMin = xpMax + 1;
      xpMax = xpMin + (level * 100) - 1;
    }

    this.currentLevel = level;
    this.currentLevelMinXP = xpMin;
    this.nextLevelMinXP = xpMax + 1;

    // Calculate progress percentage to next level
    const xpInCurrentLevel = totalXP - xpMin;
    const xpNeededForLevel = (xpMax + 1) - xpMin;
    this.progressPercentage = Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  }

  setActiveTab(tab: 'overview' | 'history' | 'languages' | 'difficulty' | 'time'): void {
    this.activeTab = tab;
  }

  getCircleStyle(): string {
    const percentage = this.progressPercentage;
    // SVG circle progress (270 degrees, leaving bottom 90 degrees empty)
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (percentage / 100) * (circumference * 0.75); // 75% of circle (270 degrees)
    return `stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};`;
  }
}