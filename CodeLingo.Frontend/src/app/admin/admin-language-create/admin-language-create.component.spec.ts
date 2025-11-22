import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLanguageCreateComponent } from './admin-language-create.component';

describe('AdminLanguageCreateComponent', () => {
  let component: AdminLanguageCreateComponent;
  let fixture: ComponentFixture<AdminLanguageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLanguageCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLanguageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
