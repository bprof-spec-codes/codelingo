import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionCountSelectorComponent } from './question-count-selector.component';
import { CommonModule } from '@angular/common';

describe('QuestionCountSelectorComponent', () => {
  let component: QuestionCountSelectorComponent;
  let fixture: ComponentFixture<QuestionCountSelectorComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionCountSelectorComponent],
      imports: [CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCountSelectorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedCount).toBe(10);
    expect(component.presetCounts).toEqual([5, 10, 20, 30]);
    expect(component.minCount).toBe(5);
    expect(component.maxCount).toBe(50);
    expect(component.customCount).toBeNull();
    expect(component.isCustom).toBe(false);
  });

  it('should render label with icon and correct text', () => {
    const label = compiled.querySelector('label.form-label');
    const icon = compiled.querySelector('label i.bi-list-ol');

    expect(label?.textContent).toContain('Number of Questions');
    expect(icon).toBeTruthy();
  });

  it('should render four preset buttons', () => {
    const buttons = compiled.querySelectorAll('.preset-button');
    expect(buttons.length).toBe(4);
    expect(buttons[0].textContent?.trim()).toBe('5 questions');
    expect(buttons[1].textContent?.trim()).toBe('10 questions');
    expect(buttons[2].textContent?.trim()).toBe('20 questions');
    expect(buttons[3].textContent?.trim()).toBe('30 questions');
  });

  it('should render custom input with correct attributes', () => {
    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    
    expect(input).toBeTruthy();
    expect(input.getAttribute('min')).toBe('5');
    expect(input.getAttribute('max')).toBe('50');
    expect(input.getAttribute('id')).toBe('custom-count');
    expect(input.placeholder).toContain('Enter number (5-50)');
  });

  it('should render current selection display', () => {
    const display = compiled.querySelector('.selection-display');
    const icon = compiled.querySelector('.selection-display i.bi-check-circle-fill');
    
    expect(display).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(display?.textContent).toContain('Selected:');
    expect(display?.textContent).toContain('10 questions');
  });

  it('should render helper text', () => {
    const helperText = compiled.querySelector('small.form-text');
    expect(helperText?.textContent).toContain('Choose between 5 and 50 questions');
  });

  it('should apply active class to selected preset button', () => {
    component.selectedCount = 20;
    component.isCustom = false;
    fixture.detectChanges();

    const buttons = compiled.querySelectorAll('.preset-button');
    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(false);
    expect(buttons[2].classList.contains('active')).toBe(true);
    expect(buttons[3].classList.contains('active')).toBe(false);
  });

  it('should emit countChange event when preset button is clicked', (done) => {
    component.countChange.subscribe((count: number) => {
      expect(count).toBe(20);
      done();
    });

    const buttons = compiled.querySelectorAll('.preset-button');
    (buttons[2] as HTMLElement).click();
    fixture.detectChanges();
  });

  it('should update selectedCount when preset button is clicked', () => {
    const buttons = compiled.querySelectorAll('.preset-button');
    (buttons[3] as HTMLElement).click();
    fixture.detectChanges();

    expect(component.selectedCount).toBe(30);
    expect(component.isCustom).toBe(false);
    expect(component.customCount).toBeNull();
  });

  it('should handle custom input within valid range', () => {
    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    
    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.selectedCount).toBe(25);
    expect(component.customCount).toBe(25);
    expect(component.isCustom).toBe(true);
  });

  it('should emit countChange event when valid custom input is entered', (done) => {
    component.countChange.subscribe((count: number) => {
      expect(count).toBe(15);
      done();
    });

    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    input.value = '15';
    input.dispatchEvent(new Event('input'));
  });

  it('should not update when custom input is below minimum', () => {
    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    const initialCount = component.selectedCount;
    
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.selectedCount).toBe(initialCount);
    expect(component.isCustom).toBe(false);
  });

  it('should limit input to 2 digits', () => {
    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    
    input.value = '123';
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: input, writable: false });
    component.onCustomInput(event);

    expect(input.value).toBe('12');
  });

  it('should limit input to maximum value of 50', () => {
    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    
    input.value = '99';
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: input, writable: false });
    component.onCustomInput(event);

    expect(input.value.length).toBeLessThanOrEqual(2);
  });

  it('should deactivate preset button when custom input is used', () => {
    component.selectedCount = 10;
    component.isCustom = false;
    fixture.detectChanges();

    let buttons = compiled.querySelectorAll('.preset-button');
    expect(buttons[1].classList.contains('active')).toBe(true);

    const input = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    buttons = compiled.querySelectorAll('.preset-button');
    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(false);
    expect(buttons[2].classList.contains('active')).toBe(false);
    expect(buttons[3].classList.contains('active')).toBe(false);
  });
});
