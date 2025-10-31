import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DifficultySelectorComponent } from './difficulty-selector.component';
import { CommonModule } from '@angular/common';

describe('DifficultySelectorComponent', () => {
  let component: DifficultySelectorComponent;
  let fixture: ComponentFixture<DifficultySelectorComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DifficultySelectorComponent],
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifficultySelectorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selectedDifficulty and three difficulty levels', () => {
    expect(component.selectedDifficulty).toBe('');
    expect(component.difficultyLevels).toBeDefined();
    expect(component.difficultyLevels.length).toBe(3);
  });

  it('should have correct difficulty levels configuration', () => {
    expect(component.difficultyLevels[0].value).toBe('easy');
    expect(component.difficultyLevels[0].label).toBe('Easy');
    expect(component.difficultyLevels[0].multiplier).toBe(1);

    expect(component.difficultyLevels[1].value).toBe('medium');
    expect(component.difficultyLevels[1].label).toBe('Medium');
    expect(component.difficultyLevels[1].multiplier).toBe(1.5);

    expect(component.difficultyLevels[2].value).toBe('hard');
    expect(component.difficultyLevels[2].label).toBe('Hard');
    expect(component.difficultyLevels[2].multiplier).toBe(2);
  });

  it('should render label with icon and correct text', () => {
    const label = compiled.querySelector('label.form-label');
    const icon = compiled.querySelector('label i.bi-speedometer2');

    expect(label?.textContent).toContain('Difficulty level');
    expect(icon).toBeTruthy();
  });

  it('should render three difficulty cards', () => {
    const cards = compiled.querySelectorAll('.difficulty-card');
    expect(cards.length).toBe(3);
  });

  it('should render radio buttons for each difficulty level', () => {
    const radioButtons = compiled.querySelectorAll('input[type="radio"]');
    expect(radioButtons.length).toBe(3);
    expect(radioButtons[0].getAttribute('id')).toBe('difficulty-easy');
    expect(radioButtons[1].getAttribute('id')).toBe('difficulty-medium');
    expect(radioButtons[2].getAttribute('id')).toBe('difficulty-hard');
  });

  it('should display difficulty labels, multipliers, and descriptions', () => {
    const labels = compiled.querySelectorAll('.difficulty-label');
    const multipliers = compiled.querySelectorAll('.difficulty-multiplier');
    const descriptions = compiled.querySelectorAll('.difficulty-description');

    expect(labels[0].textContent).toBe('Easy');
    expect(multipliers[0].textContent).toBe('x1');
    expect(descriptions[0].textContent).toContain('Perfect for beginners');

    expect(labels[1].textContent).toBe('Medium');
    expect(multipliers[1].textContent).toBe('x1.5');
    expect(descriptions[1].textContent).toContain('Intermediate challenges');

    expect(labels[2].textContent).toBe('Hard');
    expect(multipliers[2].textContent).toBe('x2');
    expect(descriptions[2].textContent).toContain('Advanced problems');
  });

  it('should render helper text', () => {
    const helperText = compiled.querySelector('small.form-text');
    expect(helperText?.textContent).toContain('Higher difficulty levels yield more points but are more challenging.');
  });

  it('should apply selected class when difficulty is selected', () => {
    component.selectedDifficulty = 'medium';
    fixture.detectChanges();

    const cards = compiled.querySelectorAll('.difficulty-card');
    expect(cards[0].classList.contains('selected')).toBe(false);
    expect(cards[1].classList.contains('selected')).toBe(true);
    expect(cards[2].classList.contains('selected')).toBe(false);
  });

  it('should check radio button when difficulty is selected', () => {
    component.selectedDifficulty = 'hard';
    fixture.detectChanges();

    const radioButtons = compiled.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    expect(radioButtons[0].checked).toBe(false);
    expect(radioButtons[1].checked).toBe(false);
    expect(radioButtons[2].checked).toBe(true);
  });

  it('should emit difficultyChange event when card is clicked', (done) => {
    component.difficultyChange.subscribe((difficulty: string) => {
      expect(difficulty).toBe('easy');
      expect(component.selectedDifficulty).toBe('easy');
      done();
    });

    const cards = compiled.querySelectorAll('.difficulty-card');
    (cards[0] as HTMLElement).click();
    fixture.detectChanges();
  });

  it('should update selectedDifficulty when card is clicked', () => {
    const cards = compiled.querySelectorAll('.difficulty-card');
    
    (cards[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(component.selectedDifficulty).toBe('medium');
  });

  it('should allow switching between difficulty levels', () => {
    const cards = compiled.querySelectorAll('.difficulty-card');

    (cards[0] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.selectedDifficulty).toBe('easy');

    (cards[2] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.selectedDifficulty).toBe('hard');

    (cards[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.selectedDifficulty).toBe('medium');
  });
});
