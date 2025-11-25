import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let compiled: HTMLElement;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['login', 'logout', 'refreshToken', 'setRememberMe'],
      { isLoggedIn$: of(false) } // default: NOT logged in
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Component Creation & Initialization
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBeNull();
  });

  // Data Arrays
  it('should have 4 features defined', () => {
    expect(component.features.length).toBe(4);
    component.features.forEach((feature) => {
      expect(feature.title).toBeDefined();
      expect(feature.description).toBeDefined();
      expect(feature.icon).toBeDefined();
    });
  });

  it('should have 3 getting started steps', () => {
    expect(component.gettingStartedSteps.length).toBe(3);
    component.gettingStartedSteps.forEach((step) => {
      expect(step.number).toBeDefined();
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
    });
  });

  // Navigation Methods
  it('should navigate to /register when signUp is called', () => {
    component.signUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to /practice/start when tryCodeLingo is called', () => {
    component.tryCodeLingo();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/practice/start']);
  });

  it('should navigate to /login when login is called', () => {
    component.login();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /practice/start when startPractice is called', () => {
    component.startPractice();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/practice/start']);
  });

  // Loading State
  it('should display loading spinner when isLoading is true', () => {
    component.state.isLoading = true;
    fixture.detectChanges();
    const spinner = compiled.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();
  });

  // Error State
  it('should display error message when error exists', () => {
    component.state.error = 'Test error message';
    component.state.isLoading = false;
    fixture.detectChanges();

    const errorAlert = compiled.querySelector('.alert-danger');
    expect(errorAlert?.textContent).toContain('Test error message');
  });

  // NOT Logged In State UI
  it('should display sign up and try buttons when not logged in', () => {
    authServiceSpy.isLoggedIn$ = of(false);
    component.ngOnInit();
    fixture.detectChanges();

    const buttons = Array.from(compiled.querySelectorAll('.btn'));
    const signUpButton = buttons.find(
      (btn) => btn.textContent?.trim() === 'Sign Up'
    );
    const tryButton = buttons.find(
      (btn) => btn.textContent?.trim() === 'Try CodeLingo'
    );

    expect(signUpButton).toBeTruthy();
    expect(tryButton).toBeTruthy();
  });

  it('should display getting started section when not logged in', () => {
    authServiceSpy.isLoggedIn$ = of(false);
    component.ngOnInit();
    fixture.detectChanges();

    const gettingStartedSection = compiled.querySelector(
      '.getting-started-section'
    );
    expect(gettingStartedSection).toBeTruthy();
  });

  // LOGGED IN State UI
  it('should display welcome message and start practice button when logged in', () => {
    // Make the observable emit `true`
    component.isLoggedIn$ = of(true);
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();

    const title = compiled.querySelector('.hero-title');
    expect(title?.textContent).toContain('Welcome back');

    const buttons = Array.from(compiled.querySelectorAll('.btn'));
    const practiceButton = buttons.find(
      (btn) => btn.textContent?.trim() === 'Start Practice'
    );
    expect(practiceButton).toBeTruthy();
  });

  // Features Section
  it('should render all 4 feature cards', () => {
    const featureCards = compiled.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(4);
  });

  // Code Block
  it('should display code block with JavaScript label', () => {
    const codeBlock = compiled.querySelector('.hero-code-block');
    const codeLang = compiled.querySelector('.code-lang');

    expect(codeBlock).toBeTruthy();
    expect(codeLang?.textContent).toContain('JavaScript');
  });
});
