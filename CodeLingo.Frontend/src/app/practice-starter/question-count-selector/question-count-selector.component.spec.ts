import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCountSelectorComponent } from './question-count-selector.component';

describe('QuestionCountSelectorComponent', () => {
  let component: QuestionCountSelectorComponent;
  let fixture: ComponentFixture<QuestionCountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionCountSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
