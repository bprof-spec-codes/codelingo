import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McQuestionEditorComponent } from './mc-question-editor.component';

describe('McQuestionEditorComponent', () => {
  let component: McQuestionEditorComponent;
  let fixture: ComponentFixture<McQuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [McQuestionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
