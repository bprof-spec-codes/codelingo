import { Component, OnInit } from '@angular/core';
import { UserStats } from '../../../models/user';
import { UserStatsService } from '../../../services/user-stats.service';

@Component({
  selector: 'app-progress-dashboard',
  standalone: false,
  templateUrl: './progress-dashboard.component.html',
  styleUrl: './progress-dashboard.component.scss'
})
export class ProgressDashboardComponent implements OnInit{
  userStats: UserStats | null = null;
  loading = true;
  error: string | null = null;
  activeTab: 'overview' | 'history' | 'languages' | 'difficulty' | 'time' = 'overview';

  constructor(private userStatsService: UserStatsService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  loadUserStats(): void {
    this.loading = true;
    this.error = null;

    this.userStatsService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
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

  setActiveTab(tab: 'overview' | 'history' | 'languages' | 'difficulty' | 'time'): void {
    this.activeTab = tab;
  }
}
