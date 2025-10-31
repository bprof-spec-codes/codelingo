import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './language-selector.component';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty languages array and selected language', () => {
    expect(component.languages).toEqual([]);
    expect(component.selectedLanguage).toBe('');
  });

  it('should accept and render languages input', () => {
    component.languages = ['C#', 'Python', 'JavaScript'];
    fixture.detectChanges();

    const options = compiled.querySelectorAll('option');
    expect(options.length).toBe(4); // +1 for default option
    expect(options[1].textContent?.trim()).toBe('C#');
    expect(options[2].textContent?.trim()).toBe('Python');
    expect(options[3].textContent?.trim()).toBe('JavaScript');
  });

  it('should render label with icon and correct text', () => {
    const label = compiled.querySelector('label');
    const icon = compiled.querySelector('label i.bi-code-slash');
    
    expect(label?.textContent).toContain('Programming Language');
    expect(icon).toBeTruthy();
  });

  it('should render select element with required attribute', () => {
    const select = compiled.querySelector('select');
    
    expect(select).toBeTruthy();
    expect(select?.classList.contains('form-select')).toBe(true);
    expect(select?.hasAttribute('required')).toBe(true);
  });

  it('should render default option as disabled', () => {
    const defaultOption = compiled.querySelector('option[value=""]');
    
    expect(defaultOption?.hasAttribute('disabled')).toBe(true);
    expect(defaultOption?.textContent?.trim()).toBe('Choose a language...');
  });

  it('should render helper text', () => {
    const helperText = compiled.querySelector('small.form-text');
    
    expect(helperText?.textContent).toContain('Select the programming language you want to practice.');
  });

  it('should emit languageChange event when language is selected', (done) => {
    component.languages = ['JavaScript', 'Python'];
    fixture.detectChanges();

    component.languageChange.subscribe((language: string) => {
      expect(language).toBe('Python');
      done();
    });

    const select: HTMLSelectElement = compiled.querySelector('select')!;
    select.value = 'Python';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  });

  it('should update selectedLanguage when user selects an option', async () => {
    component.languages = ['C++', 'Ruby', 'Go'];
    fixture.detectChanges();

    const select: HTMLSelectElement = compiled.querySelector('select')!;
    select.value = 'Go';
    select.dispatchEvent(new Event('change'));
    select.dispatchEvent(new Event('input'));
    
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.selectedLanguage).toBe('Go');
  });

  it('should support two-way binding with ngModel', async () => {
    component.languages = ['PHP', 'Ruby', 'Swift'];
    component.selectedLanguage = 'Ruby';
    fixture.detectChanges();
    await fixture.whenStable();

    const select: HTMLSelectElement = compiled.querySelector('select')!;
    expect(select.value).toBe('Ruby');

    select.value = 'Swift';
    select.dispatchEvent(new Event('change'));
    select.dispatchEvent(new Event('input'));
    
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.selectedLanguage).toBe('Swift');
  });

  it('should handle empty languages array', () => {
    component.languages = [];
    fixture.detectChanges();

    const options = compiled.querySelectorAll('option');
    expect(options.length).toBe(1); // Only default option
  });

  it('should handle language names with special characters', () => {
    component.languages = ['C++', 'C#', 'F#'];
    fixture.detectChanges();

    const options = compiled.querySelectorAll('option');
    expect(options[1].textContent?.trim()).toBe('C++');
    expect(options[2].textContent?.trim()).toBe('C#');
    expect(options[3].textContent?.trim()).toBe('F#');
  });

  it('should have proper label-select association for accessibility', () => {
    const label = compiled.querySelector('label');
    const select = compiled.querySelector('select');
    
    expect(label?.getAttribute('for')).toBe('language-select');
    expect(select?.getAttribute('id')).toBe('language-select');
  });
});
