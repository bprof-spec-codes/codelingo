import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { QuestionContainerComponent } from './question-container.component';
import { QuestionSessionService } from '../services/question-session.service';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question/multiple-choice-question.component';
import { MultipleChoiceQuestion } from '../models/multiple-choice-question';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-choice-question',
  template: '<div></div>',
})
class MockMultipleChoiceComponent {
  @Input() question!: MultipleChoiceQuestion;
  @Input() isSubmitted: boolean = false;
  @Output() answerSubmitted = new EventEmitter<string[]>();

  resetSelection() {}
}

describe('QuestionContainerComponent', () => {
  let component: QuestionContainerComponent;
  let fixture: ComponentFixture<QuestionContainerComponent>;
  let sessionService: QuestionSessionService;

  const mockQuestions: MultipleChoiceQuestion[] = [
    {
      id: 'q1',
      type: 'MC',
      language: 'csharp',
      difficulty: 'easy',
      title: 'Q1',
      questionText: 'Q1 text',
      explanation: '',
      tags: [],
      options: [{ id: 'opt1', text: 'A', order: 1 }],
      correctAnswerIds: ['opt1'],
      allowMultipleSelection: false,
      shuffleOptions: false,
      metadata: {
        version: 1,
        estimatedTimeSeconds: 10,
        pointValue: 5,
        usageCount: 0,
        averageCorrectRate: 1,
      },
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      isActive: true,
    },
    {
      id: 'q2',
      type: 'MC',
      language: 'csharp',
      difficulty: 'easy',
      title: 'Q2',
      questionText: 'Q2 text',
      explanation: '',
      tags: [],
      options: [{ id: 'opt1', text: 'B', order: 1 }],
      correctAnswerIds: ['opt1'],
      allowMultipleSelection: false,
      shuffleOptions: false,
      metadata: {
        version: 1,
        estimatedTimeSeconds: 10,
        pointValue: 5,
        usageCount: 0,
        averageCorrectRate: 1,
      },
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      isActive: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionContainerComponent], // non-standalone goes here
      imports: [MockMultipleChoiceComponent], // standalone components go here
      providers: [QuestionSessionService],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionContainerComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(QuestionSessionService);

    spyOn(sessionService, 'getConfig').and.returnValue({
      language: 'C#',
      difficulty: 'easy',
      questionCount: 2,
    });
    spyOn(sessionService, 'getQuestions').and.returnValue(mockQuestions);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set questions and load first question', fakeAsync(() => {
    component.ngOnInit();
    tick(500); // simulate loadNextQuestion delay

    expect(component.questions).toEqual(mockQuestions);
    expect(component.totalQuestions).toBe(2);
    expect(component.currentIndex).toBe(1);
    expect(component.questionData).toEqual(mockQuestions[0]);
    expect(component.isCompleted).toBeFalse();
  }));

  it('loadNextQuestion should increment index and complete session', fakeAsync(() => {
    component.questions = mockQuestions;
    component.totalQuestions = mockQuestions.length;
    component.currentIndex = 1;

    component.loadNextQuestion();
    tick(500);
    expect(component.currentIndex).toBe(2);
    expect(component.isCompleted).toBeFalse();

    component.loadNextQuestion();
    tick(500);
    expect(component.currentIndex).toBe(3);
    expect(component.isCompleted).toBeTrue();
  }));

  it('onAnswer should set isCorrect and feedback', fakeAsync(() => {
    component.questions = mockQuestions;
    component.totalQuestions = mockQuestions.length;
    component.currentIndex = 1;
    component.questionData = mockQuestions[0];

    component.onAnswer(['opt1']); // correct answer
    tick(1200);

    expect(component.isCorrect).toBeTrue();
    expect(component.feedback).toContain('Correct!');

    component.onAnswer(['wrong']); // incorrect
    tick(1200);

    expect(component.isCorrect).toBeFalse();
    expect(component.feedback).toContain('Incorrect');
  }));
});
