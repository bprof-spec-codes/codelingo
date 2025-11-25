import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';               
import { of, throwError } from 'rxjs';
import { AdminImportExportComponent } from './admin-import-export.component';
import { AdminService } from '../../services/admin.service';

describe('AdminImportExportComponent', () => {
  let component: AdminImportExportComponent;
  let fixture: ComponentFixture<AdminImportExportComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj<AdminService>(
      'AdminService',
      ['importQuestions', 'exportQuestions']
    );

    await TestBed.configureTestingModule({
      declarations: [AdminImportExportComponent],
      imports: [FormsModule],                                 
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onImportFileSelected should set selectedImportFile and clear error', () => {
    const file = new File(['test'], 'questions.json', { type: 'application/json' });

    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    component.importError = 'prev';
    component.onImportFileSelected(event);

    expect(component.selectedImportFile).toBe(file);
    expect(component.importError).toBeNull();
  });

  it('onImport should set error if no file is selected', () => {
    component.selectedImportFile = null;

    component.onImport();

    expect(component.importError).toBe('Please select a file.');
    expect(adminServiceSpy.importQuestions).not.toHaveBeenCalled();
    expect(component.isImporting).toBeFalse();
  });

  it('onImport should call service.importQuestions and reset flags on success', () => {
    const file = new File(['content'], 'questions.json', {
      type: 'application/json'
    });
    component.selectedImportFile = file;

    adminServiceSpy.importQuestions.and.returnValue(of(void 0));

    component.onImport();

    expect(adminServiceSpy.importQuestions).toHaveBeenCalledWith(file);
    expect(component.isImporting).toBeFalse();
    expect(component.importError).toBeNull();
  });

  it('onImport should set importError on error', () => {
    const file = new File(['content'], 'questions.json', {
      type: 'application/json'
    });
    component.selectedImportFile = file;

    adminServiceSpy.importQuestions.and.returnValue(
      throwError(() => ({ error: { error: 'Backend import error' } }))
    );

    component.onImport();

    expect(component.isImporting).toBeFalse();
    expect(component.importError).toBe('Backend import error');
  });

  it('onExport should call service.exportQuestions and download file on success', () => {
    component.exportFormat = 'csv';
    const blob = new Blob(['id,text'], { type: 'text/csv' });

    adminServiceSpy.exportQuestions.and.returnValue(of(blob));
    const downloadSpy = spyOn<any>(component as any, 'downloadBlob').and.stub();

    component.onExport();

    expect(adminServiceSpy.exportQuestions).toHaveBeenCalledWith({ format: 'csv' });
    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBeNull();
    expect(downloadSpy).toHaveBeenCalledWith(jasmine.any(Blob), 'questions-export.csv');
  });

  it('onExport should set exportError on error', () => {
    adminServiceSpy.exportQuestions.and.returnValue(
      throwError(() => ({ error: { error: 'Backend export error' } }))
    );

    component.onExport();

    expect(adminServiceSpy.exportQuestions).toHaveBeenCalledWith({
      format: component.exportFormat
    });
    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBe('Backend export error');
  });
});