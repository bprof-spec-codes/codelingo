import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultSummaryComponent } from './result-summary.component';
import { SessionSummary } from '../../models/session-summary';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CountUpModule } from 'ngx-countup';

describe('ResultSummaryComponent', () => {
  let component: ResultSummaryComponent;
  let fixture: ComponentFixture<ResultSummaryComponent>;
  let compiled: DebugElement;

  const mockSessionSummary: SessionSummary = {
    language: 'JavaScript',
    difficulty: 'Medium',
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 8,
    totalScore: 80,
    accuracyPercentage: 80,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultSummaryComponent],
      imports: [RouterTestingModule, CountUpModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultSummaryComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display language and difficulty correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const infoBadge = compiled.query(By.css('.info-badge'));
    expect(infoBadge.nativeElement.textContent).toContain('JAVASCRIPT');
    expect(infoBadge.nativeElement.textContent).toContain('MEDIUM');
  });

  it('should display total score', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const scoreValue = compiled.query(By.css('.score-value'));
    expect(scoreValue).toBeTruthy();
  });

  it('should display accuracy percentage correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const accuracyBadge = compiled.query(By.css('.accuracy-badge'));
    expect(accuracyBadge.nativeElement.textContent).toContain('80');
    expect(accuracyBadge.nativeElement.textContent).toContain('%');
  });

  it('should show 3 stars when accuracy is >= 80%', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const starRating = compiled.query(By.css('.star-rating'));
    expect(starRating).toBeTruthy();
    
    const activeStars = compiled.queryAll(By.css('.star-rating i.active'));
    expect(activeStars.length).toBe(3);
    
    const successMessage = compiled.query(By.css('.success-message'));
    expect(successMessage.nativeElement.textContent).toContain('Excellent Work!');
  });

  it('should show 2 stars when accuracy is between 60% and 79%', () => {
    const mediumAccuracySummary = {
      ...mockSessionSummary,
      correctAnswers: 7,
      totalScore: 70,
      accuracyPercentage: 70
    };
    
    component.sessionSummary = mediumAccuracySummary;
    fixture.detectChanges();

    const starRating = compiled.query(By.css('.star-rating'));
    expect(starRating).toBeTruthy();
    
    const activeStars = compiled.queryAll(By.css('.star-rating i.active'));
    expect(activeStars.length).toBe(2);
    
    const successMessage = compiled.query(By.css('.success-message'));
    expect(successMessage.nativeElement.textContent).toContain('Good Job!');
  });

  it('should show 1 star when accuracy is between 20% and 59%', () => {
    const lowAccuracySummary = {
      ...mockSessionSummary,
      correctAnswers: 4,
      totalScore: 40,
      accuracyPercentage: 40
    };
    
    component.sessionSummary = lowAccuracySummary;
    fixture.detectChanges();

    const starRating = compiled.query(By.css('.star-rating'));
    expect(starRating).toBeTruthy();
    
    const activeStars = compiled.queryAll(By.css('.star-rating i.active'));
    expect(activeStars.length).toBe(1);
    
    const successMessage = compiled.query(By.css('.success-message'));
    expect(successMessage.nativeElement.textContent).toContain('Keep Practicing!');
  });

  it('should show sad face when accuracy is < 20%', () => {
    const veryLowAccuracySummary = {
      ...mockSessionSummary,
      correctAnswers: 1,
      totalScore: 10,
      accuracyPercentage: 10
    };
    
    component.sessionSummary = veryLowAccuracySummary;
    fixture.detectChanges();

    const sadIcon = compiled.query(By.css('.sad-icon'));
    expect(sadIcon).toBeTruthy();
    
    const failMessage = compiled.query(By.css('.fail-message'));
    expect(failMessage.nativeElement.textContent).toContain("Don't Give Up!");
  });

  it('should have Practice Again button with correct route', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const practiceButton = compiled.query(By.css('button[routerLink="/practice/start"]'));
    expect(practiceButton).toBeTruthy();
    expect(practiceButton.nativeElement.textContent).toContain('Practice Again');
  });

  it('should have Back to Home button with correct route', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const homeButton = compiled.query(By.css('button[routerLink="/landing-page"]'));
    expect(homeButton).toBeTruthy();
    expect(homeButton.nativeElement.textContent).toContain('Back to Home');
  });

  it('should format accuracy to one decimal place', () => {
    const summaryWithDecimal = {
      ...mockSessionSummary,
      accuracyPercentage: 85.7142857
    };
    
    component.sessionSummary = summaryWithDecimal;
    fixture.detectChanges();

    const accuracyBadge = compiled.query(By.css('.accuracy-badge'));
    expect(accuracyBadge.nativeElement.textContent).toContain('85.7');
  });

  it('should display progress stats correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const progressStats = compiled.query(By.css('.progress-stats'));
    expect(progressStats.nativeElement.textContent).toContain('Answered: 10/10');
    expect(progressStats.nativeElement.textContent).toContain('Correct: 8');
  });

  it('should initialize progress percentages to 0', () => {
    expect(component.answeredPercentage).toBe(0);
    expect(component.correctPercentage).toBe(0);
  });

  it('should apply high-accuracy class when accuracy >= 80%', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const accuracyBadge = compiled.query(By.css('.accuracy-badge.high-accuracy'));
    expect(accuracyBadge).toBeTruthy();
  });

  it('should apply low-accuracy class when accuracy < 20%', () => {
    const veryLowAccuracySummary = {
      ...mockSessionSummary,
      correctAnswers: 1,
      totalScore: 10,
      accuracyPercentage: 10
    };
    
    component.sessionSummary = veryLowAccuracySummary;
    fixture.detectChanges();

    const accuracyBadge = compiled.query(By.css('.accuracy-badge.low-accuracy'));
    expect(accuracyBadge).toBeTruthy();
  });
});