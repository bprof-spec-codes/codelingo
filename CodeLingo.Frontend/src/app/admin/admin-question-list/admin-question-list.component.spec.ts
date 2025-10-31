import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuestionListComponent } from './admin-question-list.component';

describe('AdminQuestionListComponent', () => {
  let component: AdminQuestionListComponent;
  let fixture: ComponentFixture<AdminQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQuestionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
