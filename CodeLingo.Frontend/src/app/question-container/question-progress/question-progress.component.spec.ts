import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionProgressComponent } from './question-progress.component';

describe('QuestionProgressComponent', () => {
  let component: QuestionProgressComponent;
  let fixture: ComponentFixture<QuestionProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
