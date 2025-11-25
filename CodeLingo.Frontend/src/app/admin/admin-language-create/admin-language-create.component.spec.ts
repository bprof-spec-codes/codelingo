import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminLanguageCreateComponent } from './admin-language-create.component';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';

describe('AdminLanguageCreateComponent', () => {
  let component: AdminLanguageCreateComponent;
  let fixture: ComponentFixture<AdminLanguageCreateComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj<AdminService>('AdminService', ['addLanguage']);

    await TestBed.configureTestingModule({
      declarations: [AdminLanguageCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AdminService, useValue: adminServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLanguageCreateComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addLanguage when form is valid', () => {
    const lang: Language = { name: 'TypeScript', version: '5.0' } as Language;
    adminServiceSpy.addLanguage.and.returnValue(of({} as any));

    component.languageForm.setValue(lang);

    component.onCreateLanguage();

    expect(adminServiceSpy.addLanguage).toHaveBeenCalledWith(lang);
  });
});