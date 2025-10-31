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

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PracticeStarterComponent],
      imports: [CommonModule],
      providers: [
        { provide: Router, useValue: mockRouter }
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
    expect(component.availableLanguages).toEqual(['JavaScript', 'Python', 'Java', 'C#', 'TypeScript']);
    expect(component.config.language).toBe('');
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

  it('should update config language when onLangugaeChange is called', () => {
    component.onLangugaeChange('JavaScript');
    expect(component.config.language).toBe('JavaScript');
  });

  it('should update config difficulty when onDifficultyChange is called', () => {
    component.onDifficultyChange('medium');
    expect(component.config.difficulty).toBe('medium');
  });

  it('should update config questionCount when onQuestionCountChange is called', () => {
    component.onQuestionCountChange(20);
    expect(component.config.questionCount).toBe(20);
  });

  it('should disable start button when language is not selected', () => {
    component.config.language = '';
    component.config.difficulty = 'easy';
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should disable start button when difficulty is not selected', () => {
    component.config.language = 'Python';
    component.config.difficulty = '';
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should enable start button when language and difficulty are selected', () => {
    component.config.language = 'Python';
    component.config.difficulty = 'medium';
    
    expect(component.isStartButtonDisabled).toBe(false);
  });

  it('should disable start button when loading', () => {
    component.config.language = 'Python';
    component.config.difficulty = 'medium';
    component.state.isLoading = true;
    
    expect(component.isStartButtonDisabled).toBe(true);
  });

  it('should show configuration summary when language and difficulty are selected', () => {
    component.config.language = 'JavaScript';
    component.config.difficulty = 'hard';
    component.config.questionCount = 25;
    fixture.detectChanges();

    const summary = compiled.querySelector('.config-summary');
    expect(summary).toBeTruthy();
    expect(summary?.textContent).toContain('JavaScript');
    expect(summary?.textContent).toContain('hard');
    expect(summary?.textContent).toContain('25');
  });

  it('should hide configuration summary when language is not selected', () => {
    component.config.language = '';
    component.config.difficulty = 'easy';
    fixture.detectChanges();

    const summary = compiled.querySelector('.config-summary');
    expect(summary).toBeFalsy();
  });

  it('should set loading state during startSession', async () => {
    component.config.language = 'Python';
    component.config.difficulty = 'easy';
    
    const sessionPromise = component.startSession();
    expect(component.state.isLoading).toBe(true);
    
    await sessionPromise;
    expect(component.state.isLoading).toBe(false);
  });

  it('should clear error when startSession is called', async () => {
    component.state.error = 'Previous error';
    component.config.language = 'Java';
    component.config.difficulty = 'medium';
    
    spyOn(window, 'alert');
    await component.startSession();
    
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
