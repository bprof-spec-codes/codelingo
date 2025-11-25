import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { AdminLanguageListComponent } from './admin-language-list.component';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';

describe('AdminLanguageListComponent', () => {
  let component: AdminLanguageListComponent;
  let fixture: ComponentFixture<AdminLanguageListComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj<AdminService>('AdminService', [
      'getLanguages',
      'updateLanguage',
      'deleteLanguage'
    ]);

    const mockLanguages: Language[] = [
      new Language(
        'lang-1',
        'TypeScript',
        '5.6',
        '2025-01-01T10:00:00Z',
        '2025-01-10T12:00:00Z'
      )
    ];

    adminServiceSpy.getLanguages.and.returnValue(of(mockLanguages));

    await TestBed.configureTestingModule({
      declarations: [AdminLanguageListComponent],
      imports: [CommonModule],
      providers: [{ provide: AdminService, useValue: adminServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLanguageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit lefut, languages$ beáll
  });

  it('should create and load languages$', (done) => {
    expect(component).toBeTruthy();

    component.languages$.subscribe((langs) => {
      expect(langs.length).toBe(1);
      expect(langs[0].name).toBe('TypeScript');
      done();
    });
  });

  it('onEdit should set editingLanguage and editModel', () => {
    const lang = new Language(
      'lang-2',
      'JavaScript',
      'ES2023',
      '2025-01-05T09:30:00Z',
      '2025-01-15T14:20:00Z'
    );

    component.onEdit(lang);

    expect(component.editingLanguage).not.toBeNull();
    expect(component.editingLanguage?.id).toBe('lang-2');
    expect(component.editModel.name).toBe('JavaScript');
    expect(component.editModel.version).toBe('ES2023');
  });

  it('onSaveEdit should call updateLanguage and reset editingLanguage', () => {
    const lang = new Language(
      'lang-3',
      'C#',
      '12.0',
      '2025-02-01T08:00:00Z',
      '2025-02-03T16:45:00Z'
    );

    component.editingLanguage = lang;
    component.editModel = { name: 'C# (edited)', version: '12.1' };

    adminServiceSpy.updateLanguage.and.returnValue(of(lang));

    component.onSaveEdit();

    expect(adminServiceSpy.updateLanguage).toHaveBeenCalledWith('lang-3', {
      name: 'C# (edited)',
      version: '12.1'
    });

    expect(component.editingLanguage).toBeNull();
  });

  it('onDelete should call deleteLanguage with language id', () => {
    const lang = new Language(
      'lang-4',
      'Python',
      '3.13',
      '2025-03-10T11:15:00Z',
      '2025-03-20T18:30:00Z'
    );

    adminServiceSpy.deleteLanguage.and.returnValue(of(void 0));

    component.onDelete(lang);

    expect(adminServiceSpy.deleteLanguage).toHaveBeenCalledWith('lang-4');
  });

  it('onCancelEdit should clear editingLanguage', () => {
    const lang = new Language(
      'lang-5',
      'Go',
      '1.23',
      '2025-04-01T08:00:00Z',
      '2025-04-02T10:00:00Z'
    );

    component.editingLanguage = lang;

    component.onCancelEdit();

    expect(component.editingLanguage).toBeNull();
  });
});