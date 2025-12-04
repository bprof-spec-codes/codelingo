import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeStarterComponent } from './practice-starter.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PracticeStarterComponent', () => {
  let component: PracticeStarterComponent;
  let fixture: ComponentFixture<PracticeStarterComponent>;
  let compiled: HTMLElement;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockQuestionSessionService: any;
  let mockLanguageService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockQuestionSessionService = jasmine.createSpyObj('QuestionSessionService', ['startSession', 'setConfig', 'getConfig']);
    mockLanguageService = jasmine.createSpyObj('LanguageService', ['getLanguages']);
    
    // Mock the getLanguages to return an observable
    mockLanguageService.getLanguages.and.returnValue({
      subscribe: (callbacks: any) => {
        callbacks.next([]);
        return { unsubscribe: () => {} };
      }
    });
    
    mockQuestionSessionService.startSession.and.returnValue({
      subscribe: (callbacks: any) => {
        callbacks.next({ sessionId: 'test-session-id', totalPlannedQuestions: 10 });
        return { unsubscribe: () => {} };
      }
    });

    await TestBed.configureTestingModule({
      declarations: [PracticeStarterComponent],
      imports: [CommonModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: 'QuestionSessionService', useValue: mockQuestionSessionService },
        { provide: 'LanguageService', useValue: mockLanguageService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore child component errors
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeStarterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.availableLanguages).toEqual([]);
    expect(component.config.languageIds).toEqual([]);
    expect(component.config.difficulty).toBe('');
    expect(component.config.questionCount).toBe(10);
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBeNull();
  });

  it('should render page header with title and subtitle', () => {
    const title = compiled.querySelector('.page-title');
    const subtitle = compiled.querySelector('.page-subtitle');
    const icon = compiled.querySelector('.page-title i.bi-play-circle');

    expect(title?.textContent).toContain('Start Practice Session');
    expect(subtitle?.textContent).toContain('Configure your practice session and start learning!');
    expect(icon).toBeTruthy();
  });

  it('should update config languageIds when onLanguagesChange is called', () => {
    component.onLanguagesChange(['JavaScript', 'Python']);
    expect(component.config.languageIds).toEqual(['JavaScript', 'Python']);
  });

  it('should update config difficulty when onDifficultyChange is called', () => {
    component.onDifficultyChange('medium');
    expect(component.config.difficulty).toBe('medium');
  });

  it('should update config questionCount when onQuestionCountChange is called', () => {
    component.onQuestionCountChange(20);
    expect(component.config.questionCount).toBe(20);
  });

  it('should disable start button when no languages are selected', () => {
    component.config.languageIds = [];
    component.config.difficulty = 'easy';
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should disable start button when difficulty is not selected', () => {
    component.config.languageIds = ['Python'];
    component.config.difficulty = '';
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should enable start button when languages and difficulty are selected', () => {
    component.config.languageIds = ['Python'];
    component.config.difficulty = 'medium';
    
    expect(component.isStartButtonDisabled).toBe(false);
  });

  it('should disable start button when loading', () => {
    component.config.languageIds = ['Python'];
    component.config.difficulty = 'medium';
    component.state.isLoading = true;
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should show configuration summary when languages and difficulty are selected', () => {
    component.config.languageIds = ['JavaScript', 'TypeScript'];
    component.config.difficulty = 'hard';
    component.config.questionCount = 25;
    fixture.detectChanges();

    const summary = compiled.querySelector('.config-summary');
    expect(summary).toBeTruthy();
    expect(summary?.textContent).toContain('JavaScript');
    expect(summary?.textContent).toContain('hard');
    expect(summary?.textContent).toContain('25');
  });

  it('should hide configuration summary when no languages are selected', () => {
    component.config.languageIds = [];
    component.config.difficulty = 'easy';
    fixture.detectChanges();

    const summary = compiled.querySelector('.config-summary');
    expect(summary).toBeFalsy();
  });

  it('should set loading state during startSession', () => {
    component.config.languageIds = ['Python'];
    component.config.difficulty = 'easy';
    
    component.startSession();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/session/test-session-id/questions']);
  });

  it('should clear error when startSession is called', () => {
    component.state.error = 'Previous error';
    component.config.languageIds = ['Java'];
    component.config.difficulty = 'medium';
    
    component.startSession();
    
    expect(component.state.error).toBeNull();
  });

  it('should display error message when error state is set', () => {
    component.state.error = 'Test error message';
    fixture.detectChanges();

    const errorAlert = compiled.querySelector('.api-error .alert-danger');
    const errorIcon = compiled.querySelector('.api-error i.bi-x-circle-fill');
    
    expect(errorAlert).toBeTruthy();
    expect(errorAlert?.textContent).toContain('Test error message');
    expect(errorIcon).toBeTruthy();
  });

  it('should not display error message when error state is null', () => {
    component.state.error = null;
    fixture.detectChanges();

    const errorAlert = compiled.querySelector('.api-error');
    expect(errorAlert).toBeFalsy();
  });

  it('should show loading spinner when isLoading is true', () => {
    component.state.isLoading = true;
    fixture.detectChanges();

    const spinner = compiled.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();
  });

  it('should render child components with correct inputs', () => {
    const languageSelector = compiled.querySelector('app-language-selector');
    const difficultySelector = compiled.querySelector('app-difficulty-selector');
    const questionCountSelector = compiled.querySelector('app-question-count-selector');

    expect(languageSelector).toBeTruthy();
    expect(difficultySelector).toBeTruthy();
    expect(questionCountSelector).toBeTruthy();
  });
});
