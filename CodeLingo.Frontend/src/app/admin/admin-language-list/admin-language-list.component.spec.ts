import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLanguageListComponent } from './admin-language-list.component';

describe('AdminLanguageListComponent', () => {
  let component: AdminLanguageListComponent;
  let fixture: ComponentFixture<AdminLanguageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLanguageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLanguageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
