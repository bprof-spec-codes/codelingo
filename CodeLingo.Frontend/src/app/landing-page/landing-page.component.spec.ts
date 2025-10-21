import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  // Component Creation & Initialization
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBeNull();
    expect(component.isLoggedIn).toBe(false);
  });

  // Data Arrays
  it('should have 4 features defined', () => {
    expect(component.features.length).toBe(4);
    component.features.forEach(feature => {
      expect(feature.title).toBeDefined();
      expect(feature.description).toBeDefined();
      expect(feature.icon).toBeDefined();
    });
  });

  it('should have 3 getting started steps', () => {
    expect(component.gettingStartedSteps.length).toBe(3);
    component.gettingStartedSteps.forEach(step => {
      expect(step.number).toBeDefined();
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
    });
  });

  // Component Methods
  it('should call signUp method', () => {
    spyOn(console, 'log');
    component.signUp();
    expect(console.log).toHaveBeenCalledWith('Navigate to sign in');
  });

  it('should call tryCodeLingo method', () => {
    spyOn(console, 'log');
    component.tryCodeLingo();
    expect(console.log).toHaveBeenCalledWith('Navigate to a demo practice session');
  });

  it('should set isLoggedIn to true when login is called', () => {
    component.isLoggedIn = false;
    component.login();
    expect(component.isLoggedIn).toBe(true);
  });

  it('should set isLoggedIn to false when startPractice is called', () => {
    component.isLoggedIn = true;
    component.startPractice();
    expect(component.isLoggedIn).toBe(false);
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

  // Not Logged In State
  it('should display sign up and try buttons when not logged in', () => {
    component.isLoggedIn = false;
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();
    
    const buttons = Array.from(compiled.querySelectorAll('.btn'));
    const signUpButton = buttons.find(btn => btn.textContent?.trim() === 'Sign Up');
    const tryButton = buttons.find(btn => btn.textContent?.trim() === 'Try CodeLingo');
    
    expect(signUpButton).toBeTruthy();
    expect(tryButton).toBeTruthy();
  });

  it('should display getting started section when not logged in', () => {
    component.isLoggedIn = false;
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();
    
    const gettingStartedSection = compiled.querySelector('.getting-started-section');
    expect(gettingStartedSection).toBeTruthy();
  });

  // Logged In State
  it('should display welcome message and start practice button when logged in', () => {
    component.isLoggedIn = true;
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();
    
    const title = compiled.querySelector('.hero-title');
    const buttons = Array.from(compiled.querySelectorAll('.btn'));
    const practiceButton = buttons.find(btn => btn.textContent?.trim() === 'Start Practice');
    
    expect(title?.textContent).toContain('Welcome back');
    expect(practiceButton).toBeTruthy();
  });

  // Features Section
  it('should render all 4 feature cards', () => {
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();
    
    const featureCards = compiled.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(4);
  });

  // Code Block
  it('should display code block with JavaScript label', () => {
    component.state.isLoading = false;
    component.state.error = null;
    fixture.detectChanges();
    
    const codeBlock = compiled.querySelector('.hero-code-block');
    const codeLang = compiled.querySelector('.code-lang');
    
    expect(codeBlock).toBeTruthy();
    expect(codeLang?.textContent).toContain('JavaScript');
  });
});
