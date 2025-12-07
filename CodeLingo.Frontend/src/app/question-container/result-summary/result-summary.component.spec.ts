import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultSummaryComponent } from './result-summary.component';
import { SessionSummary } from '../../models/session-summary';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultSummaryComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display session summary data correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const languageValue = compiled.query(By.css('.card-body:has(.bi-code-square) .card-value'));
    const difficultyValue = compiled.query(By.css('.card-body:has(.bi-speedometer2) .card-value'));
    const totalQuestionsValue = compiled.query(By.css('.card-body:has(.bi-question-circle) .card-value'));
    const totalScoreValue = compiled.query(By.css('.card-body:has(.bi-star-fill) .card-value'));

    expect(languageValue.nativeElement.textContent).toContain('JavaScript');
    expect(difficultyValue.nativeElement.textContent).toContain('Medium');
    expect(totalQuestionsValue.nativeElement.textContent).toContain('10');
    expect(totalScoreValue.nativeElement.textContent).toContain('80');
  });

  it('should display answered questions correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const answeredValue = compiled.query(By.css('.card-body:has(.bi-pencil-square) .card-value'));
    expect(answeredValue.nativeElement.textContent).toContain('10');
  });

  it('should display correct answers correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const correctValue = compiled.query(By.css('.card-body:has(.bi-check-circle) .card-value'));
    expect(correctValue.nativeElement.textContent).toContain('8');
  });

  it('should display accuracy percentage correctly', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const accuracyValue = compiled.query(By.css('.card-body:has(.bi-bullseye) .card-value'));
    expect(accuracyValue.nativeElement.textContent).toContain('80');
    expect(accuracyValue.nativeElement.textContent).toContain('%');
  });

  it('should show success animation when accuracy is >= 80%', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const successAnimation = compiled.query(By.css('.success-animation'));
    expect(successAnimation).toBeTruthy();
    
    const trophyIcon = compiled.query(By.css('.trophy-icon'));
    expect(trophyIcon).toBeTruthy();
    
    const successMessage = compiled.query(By.css('.success-message'));
    expect(successMessage.nativeElement.textContent).toContain('Excellent Work!');
  });

  it('should NOT show success animation when accuracy is < 80%', () => {
    const lowAccuracySummary = {
      ...mockSessionSummary,
      correctAnswers: 5,
      totalScore: 50,
      accuracyPercentage: 50
    };
    
    component.sessionSummary = lowAccuracySummary;
    fixture.detectChanges();

    const successAnimation = compiled.query(By.css('.success-animation'));
    expect(successAnimation).toBeFalsy();
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

    const accuracyValue = compiled.query(By.css('.card-body:has(.bi-bullseye) .card-value'));
    expect(accuracyValue.nativeElement.textContent).toContain('85.7');
  });

  it('should display all required icons', () => {
    component.sessionSummary = mockSessionSummary;
    fixture.detectChanges();

    const icons = [
      '.bi-star-fill',
      '.bi-code-square',
      '.bi-speedometer2',
      '.bi-question-circle',
      '.bi-pencil-square',
      '.bi-check-circle',
      '.bi-bullseye'
    ];

    icons.forEach(iconClass => {
      const icon = compiled.query(By.css(iconClass));
      expect(icon).toBeTruthy(`Icon ${iconClass} should be present`);
    });
  });
});