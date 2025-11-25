import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AdminEditComponent } from './admin-edit.component';
import {
  Question,
  QuestionType,
  MultipleChoiceQuestion,
  CodeCompletionQuestion
} from '../../models/question';

describe('AdminEditComponent', () => {
  let component: AdminEditComponent;
  let fixture: ComponentFixture<AdminEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditComponent],
      imports: [ReactiveFormsModule],
      // ha a template-ben vannak egyéb komponensek, ne zavarjanak
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEditComponent);
    component = fixture.componentInstance;
  });

  it('should create and init form with defaults', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.questionForm).toBeTruthy();
    expect(component.questionForm.get('type')?.value).toBe(QuestionType.MultipleChoice);
    expect(component.questionForm.get('difficulty')?.value).toBe('medium');
    expect(component.options instanceof FormArray).toBeTrue();
  });

  it('should patch form for MultipleChoice question', () => {
    const mcQuestion: MultipleChoiceQuestion = {
      id: '1',
      type: QuestionType.MultipleChoice,
      language: 'TypeScript',
      difficulty: 'easy',
      title: 'MC kérdés',
      questionText: 'Mi ez?',
      explanation: 'magyarázat',
      tags: ['tag1', 'tag2'],
      metadata: { category: 'cat', topic: 'top', source: 'src' },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'tester',
      isActive: true,
      options: [
        { text: 'A', isCorrect: true },
        { text: 'B', isCorrect: false }
      ],
      allowMultipleSelection: false,
      shuffleOptions: true
    };

    component.question = mcQuestion;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.questionForm.get('title')?.value).toBe('MC kérdés');
    expect(component.questionForm.get('language')?.value).toBe('TypeScript');
    expect(component.questionForm.get('shuffleOptions')?.value).toBeTrue();
    expect(component.options.length).toBe(2);
  });

  it('should emit save with MultipleChoiceQuestion when saveQuestion called', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const emitted: Question[] = [];
    component.save.subscribe(q => emitted.push(q));

    // alap mezők
    component.questionForm.patchValue({
      type: QuestionType.MultipleChoice,
      language: 'TS',
      difficulty: 'easy',
      title: 'Teszt MC',
      questionText: 'Kérdés szöveg',
      explanation: 'exp',
      tags: 'tag1, tag2',
      isActive: true,
      shuffleOptions: false
    });

    // options FormArray feltöltése
    const optsFa = component.options;
    (optsFa as FormArray).clear();
    optsFa.push(
      new FormGroup({
        text: new FormControl('opt1'),
        isCorrect: new FormControl(true)
      })
    );
    optsFa.push(
      new FormGroup({
        text: new FormControl('opt2'),
        isCorrect: new FormControl(false)
      })
    );

    component.saveQuestion();

    expect(emitted.length).toBe(1);
    const q = emitted[0] as MultipleChoiceQuestion;
    expect(q.type).toBe(QuestionType.MultipleChoice);
    expect(q.title).toBe('Teszt MC');
    expect(q.tags).toEqual(['tag1', 'tag2']);
    expect(q.options.length).toBe(2);
    expect(q.options[0].text).toBe('opt1');
    expect(q.options[0].isCorrect).toBeTrue();
  });

  it('should emit save with CodeCompletionQuestion when type is CodeCompletion', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const emitted: Question[] = [];
    component.save.subscribe(q => emitted.push(q));

    component.questionForm.patchValue({
      type: QuestionType.CodeCompletion,
      language: 'Python',
      difficulty: 'hard',
      title: 'CC kérdés',
      questionText: 'Írj kódot',
      explanation: '',
      tags: '',
      isActive: true,
      starterCode: 'print()',
      correctAnswer: 'print("ok")'
    });

    component.hints.push(new FormControl('hint1'));
    component.constraints.push(new FormControl('constraint1'));

    component.saveQuestion();

    expect(emitted.length).toBe(1);
    const q = emitted[0] as CodeCompletionQuestion;
    expect(q.type).toBe(QuestionType.CodeCompletion);
    expect(q.starterCode).toBe('print()');
    expect(q.correctAnswer).toBe('print("ok")');
    expect(q.hints).toEqual(['hint1']);
    expect(q.constraints).toEqual(['constraint1']);
  });

  it('should emit cancel on onCancel', () => {
    const spy = jasmine.createSpy('cancelSpy');
    component.cancel.subscribe(spy);

    component.onCancel();

    expect(spy).toHaveBeenCalled();
  });
});