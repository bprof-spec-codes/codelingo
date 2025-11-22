import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImportExportComponent } from './admin-import-export.component';

describe('AdminImportExportComponent', () => {
  let component: AdminImportExportComponent;
  let fixture: ComponentFixture<AdminImportExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminImportExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
