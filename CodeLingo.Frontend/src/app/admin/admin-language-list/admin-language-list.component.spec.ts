import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AdminLanguageListComponent } from './admin-language-list.component';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';

describe('AdminLanguageListComponent', () => {
  let component: AdminLanguageListComponent;
  let fixture: ComponentFixture<AdminLanguageListComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getLanguages',
      'addLanguage',
      'updateLanguage',
      'deleteLanguage',
    ]);
    adminServiceSpy.getLanguages.and.returnValue(
      of([
        new Language(
          1,
          'TypeScript',
          'ts',
          '5.0',
          '2024-01-01T10:00:00Z',
          '2024-01-05T14:30:00Z'
        ),
        new Language(
          2,
          'JavaScript',
          'js',
          'ES2023',
          '2023-12-01T09:00:00Z',
          '2023-12-10T11:00:00Z'
        ),
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [AdminLanguageListComponent],
      imports: [CommonModule, FormsModule],
      providers: [{ provide: AdminService, useValue: adminServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLanguageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load languages$', (done) => {
    expect(component).toBeTruthy();
    expect(adminServiceSpy.getLanguages).toHaveBeenCalled();

    component.languages$.subscribe((languages) => {
      expect(languages.length).toBe(2);
      expect(languages[0].name).toBe('TypeScript');
      expect(languages[1].name).toBe('JavaScript');
      done();
    });
  });

  it('onEdit should set editingLanguage and editModel', () => {
    const lang = new Language(
      2,
      'JavaScript',
      'js',
      'ES2023',
      '2023-12-01T09:00:00Z',
      '2023-12-10T11:00:00Z'
    );
    component.onEdit(lang);

    expect(component.editingLanguage?.id).toBe(2);
    expect(component.editModel.name).toBe('JavaScript');
    expect(component.editModel.version).toBe('ES2023');
    expect(component.editModel.shortCode).toBe('js');
  });

  it('onSaveEdit should call updateLanguage and reset editingLanguage', () => {
    const lang = new Language(
      3,
      'C#',
      'cs',
      '12.0',
      '2025-02-01T08:00:00Z',
      '2025-02-03T16:45:00Z'
    );

    component.editingLanguage = lang;
    component.editModel = { name: 'C# (edited)', version: '12.1', shortCode: 'cs-edited' };

    adminServiceSpy.updateLanguage.and.returnValue(of(lang));

    component.onSaveEdit();

    expect(adminServiceSpy.updateLanguage).toHaveBeenCalledWith(3, {
      name: 'C# (edited)',
      version: '12.1',
      shortCode: 'cs-edited'
    });

    expect(component.editingLanguage).toBeNull();
  });

  it('onDelete should call deleteLanguage with language id', () => {
    const lang = new Language(
      4,
      'Python',
      'py',
      '3.13',
      '2025-03-10T11:15:00Z',
      '2025-03-20T18:30:00Z'
    );

    adminServiceSpy.deleteLanguage.and.returnValue(of(void 0));

    component.onDelete(lang);

    expect(adminServiceSpy.deleteLanguage).toHaveBeenCalledWith(4);
  });
});