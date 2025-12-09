import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressDashboardComponent } from './progress-dashboard.component';
import { UserStatsService } from '../../../services/user-stats.service';
import { of, throwError } from 'rxjs';
import { UserStats, UserStatistics } from '../../../models/user';

describe('ProgressDashboardComponent', () => {
  let component: ProgressDashboardComponent;
  let fixture: ComponentFixture<ProgressDashboardComponent>;
  let mockUserStatsService: jasmine.SpyObj<UserStatsService>;

  const mockUserStats: UserStats = {
    userId: 'test-user-id',
    totalScore: 350,
    accuracyPercentage: 75.5,
    sessionCount: 10,
    historicalProgress: {
      sessions: [
        {
          sessionId: "new_session",
          date: '2024-01-01',
          language: 'JavaScript',
          difficulty: 'Medium',
          score: 50,
          accuracy: 80
        }
      ]
    },
    languageBreakdown: {
      items: [
        {
          language: 'JavaScript',
          totalScore: 200,
          accuracyPercentage: 75,
          sessionCount: 5
        }
      ]
    },
    difficultyBreakdown: {
      items: [
        {
          difficulty: 'Medium',
          totalScore: 150,
          accuracyPercentage: 70,
          sessionCount: 3
        }
      ]
    },
    timeBasedStats: {
      daily: { score: 50 },
      weekly: { score: 200 },
      monthly: { score: 350 }
    }
  };

  const mockUserStatistics: UserStatistics = {
    accuracy: 70,
    totalQuestionsAnswered: 150,
    currentStreak: 5,
    rank: 3
  };

  beforeEach(async () => {
    mockUserStatsService = jasmine.createSpyObj('UserStatsService', ['getUserStats', 'getStatistics']);

    await TestBed.configureTestingModule({
      declarations: [ProgressDashboardComponent],
      providers: [
        { provide: UserStatsService, useValue: mockUserStatsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load user stats on init', () => {
      mockUserStatsService.getUserStats.and.returnValue(of(mockUserStats));
      mockUserStatsService.getStatistics.and.returnValue(of(mockUserStatistics));

      component.ngOnInit();

      expect(mockUserStatsService.getUserStats).toHaveBeenCalled();
      expect(mockUserStatsService.getStatistics).toHaveBeenCalled();
      expect(component.userStats).toEqual(mockUserStats);
      expect(component.userStatistics).toEqual(mockUserStatistics);
      expect(component.loading).toBeFalse();
    });

    it('should set error message when stats loading fails with 404', () => {
      mockUserStatsService.getUserStats.and.returnValue(throwError(() => ({ status: 404 })));
      mockUserStatsService.getStatistics.and.returnValue(throwError(() => ({ status: 404 })));

      component.ngOnInit();

      expect(component.error).toBe('No statistics available yet. Complete some practice sessions to see your progress!');
      expect(component.loading).toBeFalse();
    });

    it('should set generic error message when stats loading fails with other error', () => {
      mockUserStatsService.getUserStats.and.returnValue(throwError(() => ({ status: 500 })));
      mockUserStatsService.getStatistics.and.returnValue(throwError(() => ({ status: 500 })));

      component.ngOnInit();

      expect(component.error).toBe('Failed to load statistics. Please try again later.');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Level Calculation', () => {
    it('should calculate level 1 for XP 0-99', () => {
      component.calculateLevel(0);
      expect(component.currentLevel).toBe(1);
      expect(component.currentLevelMinXP).toBe(0);
      expect(component.nextLevelMinXP).toBe(100);

      component.calculateLevel(99);
      expect(component.currentLevel).toBe(1);
    });

    it('should calculate level 2 for XP 100-299', () => {
      component.calculateLevel(100);
      expect(component.currentLevel).toBe(2);
      expect(component.currentLevelMinXP).toBe(100);
      expect(component.nextLevelMinXP).toBe(300);

      component.calculateLevel(299);
      expect(component.currentLevel).toBe(2);
    });

    it('should calculate level 3 for XP 300-599', () => {
      component.calculateLevel(300);
      expect(component.currentLevel).toBe(3);
      expect(component.currentLevelMinXP).toBe(300);
      expect(component.nextLevelMinXP).toBe(600);

      component.calculateLevel(599);
      expect(component.currentLevel).toBe(3);
    });

    it('should calculate level 5 for XP 1000-1499', () => {
      component.calculateLevel(1000);
      expect(component.currentLevel).toBe(5);
      expect(component.currentLevelMinXP).toBe(1000);
      expect(component.nextLevelMinXP).toBe(1500);
    });

    it('should calculate progress percentage correctly', () => {
      // Level 3: 300-599 XP (300 XP range)
      // At 450 XP: 150 XP into level = 50%
      component.calculateLevel(450);
      expect(component.progressPercentage).toBe(50);

      // Level 2: 100-299 XP (200 XP range)
      // At 200 XP: 100 XP into level = 50%
      component.calculateLevel(200);
      expect(component.progressPercentage).toBe(50);

      // At start of level: 0%
      component.calculateLevel(300);
      expect(component.progressPercentage).toBe(0);
    });

    it('should cap progress percentage at 100%', () => {
      component.calculateLevel(99);
      expect(component.progressPercentage).toBeLessThanOrEqual(100);
    });

    it('should calculate level correctly when loading user stats', () => {
      mockUserStatsService.getUserStats.and.returnValue(of(mockUserStats));
      mockUserStatsService.getStatistics.and.returnValue(of(mockUserStatistics));

      component.ngOnInit();

      expect(component.currentLevel).toBe(3);
      expect(component.currentLevelMinXP).toBe(300);
      expect(component.nextLevelMinXP).toBe(600);
    });
  });

  describe('Tab Navigation', () => {
    it('should set active tab to overview by default', () => {
      expect(component.activeTab).toBe('overview');
    });

    it('should change active tab when setActiveTab is called', () => {
      component.setActiveTab('history');
      expect(component.activeTab).toBe('history');

      component.setActiveTab('languages');
      expect(component.activeTab).toBe('languages');

      component.setActiveTab('difficulty');
      expect(component.activeTab).toBe('difficulty');

      component.setActiveTab('time');
      expect(component.activeTab).toBe('time');
    });
  });

  describe('Data Display', () => {
    beforeEach(() => {
      mockUserStatsService.getUserStats.and.returnValue(of(mockUserStats));
      mockUserStatsService.getStatistics.and.returnValue(of(mockUserStatistics));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display user stats after loading', () => {
      expect(component.userStats).toBeTruthy();
      expect(component.userStats?.totalScore).toBe(350);
      expect(component.userStats?.accuracyPercentage).toBe(75.5);
      expect(component.userStats?.sessionCount).toBe(10);
    });

    it('should display user statistics after loading', () => {
      expect(component.userStatistics).toBeTruthy();
      expect(component.userStatistics?.totalQuestionsAnswered).toBe(150);
      expect(component.userStatistics?.currentStreak).toBe(5);
    });

    it('should have language breakdown data', () => {
      expect(component.userStats?.languageBreakdown.items.length).toBeGreaterThan(0);
      expect(component.userStats?.languageBreakdown.items[0].language).toBe('JavaScript');
    });

    it('should have difficulty breakdown data', () => {
      expect(component.userStats?.difficultyBreakdown.items.length).toBeGreaterThan(0);
      expect(component.userStats?.difficultyBreakdown.items[0].difficulty).toBe('Medium');
    });

    it('should have time-based stats data', () => {
      expect(component.userStats?.timeBasedStats).toBeTruthy();
      expect(component.userStats?.timeBasedStats.daily.score).toBe(50);
      expect(component.userStats?.timeBasedStats.weekly.score).toBe(200);
      expect(component.userStats?.timeBasedStats.monthly.score).toBe(350);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty session history', () => {
      const emptyStats = { ...mockUserStats, historicalProgress: { sessions: [] } };
      mockUserStatsService.getUserStats.and.returnValue(of(emptyStats));
      mockUserStatsService.getStatistics.and.returnValue(of(mockUserStatistics));

      component.ngOnInit();

      expect(component.userStats?.historicalProgress.sessions.length).toBe(0);
    });

    it('should handle empty language breakdown', () => {
      const emptyStats = { ...mockUserStats, languageBreakdown: { items: [] } };
      mockUserStatsService.getUserStats.and.returnValue(of(emptyStats));
      mockUserStatsService.getStatistics.and.returnValue(of(mockUserStatistics));

      component.ngOnInit();

      expect(component.userStats?.languageBreakdown.items.length).toBe(0);
    });

    it('should handle null userStatistics gracefully', () => {
      mockUserStatsService.getUserStats.and.returnValue(of(mockUserStats));
      mockUserStatsService.getStatistics.and.returnValue(throwError(() => ({ status: 404 })));

      component.ngOnInit();

      expect(component.userStatistics).toBeNull();
    });

    it('should handle zero XP correctly', () => {
      component.calculateLevel(0);
      expect(component.currentLevel).toBe(1);
      expect(component.progressPercentage).toBe(0);
    });

    it('should handle very high XP values', () => {
      component.calculateLevel(10000);
      expect(component.currentLevel).toBeGreaterThan(10);
      expect(component.progressPercentage).toBeGreaterThanOrEqual(0);
      expect(component.progressPercentage).toBeLessThanOrEqual(100);
    });
  });
});