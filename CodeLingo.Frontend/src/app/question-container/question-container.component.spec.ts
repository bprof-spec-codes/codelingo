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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-multiple-choice-question',
  template: '<div></div>',
})
class MockMultipleChoiceComponent {
  @Input() question!: MultipleChoiceQuestion;
  @Input() isSubmitted: boolean = false;
  @Output() answerSubmitted = new EventEmitter<string[]>();

  resetSelection() { }
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
      declarations: [QuestionContainerComponent],
      imports: [MockMultipleChoiceComponent],
      providers: [
        {
          provide: QuestionSessionService,
          useValue: jasmine.createSpyObj('QuestionSessionService', ['getNextQuestion', 'submitAnswer'])
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'session-123' } } }
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionContainerComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(QuestionSessionService);

    (sessionService.getNextQuestion as jasmine.Spy).and.returnValue(of({
      questionId: 'q1',
      questionType: 'MC',
      questionData: mockQuestions[0],
      currentIndex: 1,
      totalQuestions: 2,
      isCompleted: false,
      metadata: {}
    }));

    (sessionService.submitAnswer as jasmine.Spy).and.returnValue(of({
      isCorrect: true,
      feedback: 'Correct!',
      score: 10,
      currentIndex: 1,
      totalQuestions: 2,
      isCompleted: false
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load next question', () => {
    component.ngOnInit();
    expect(sessionService.getNextQuestion).toHaveBeenCalledWith('session-123');
    expect(component.questionData).toEqual(mockQuestions[0]);
    expect(component.currentIndex).toBe(1);
    expect(component.totalQuestions).toBe(2);
  });

  it('loadNextQuestion should handle completion', () => {
    (sessionService.getNextQuestion as jasmine.Spy).and.returnValue(of({
      isCompleted: true
    }));

    component.sessionId = 'session-123';
    component.loadNextQuestion();

    expect(component.isCompleted).toBeTrue();
  });

  it('onAnswer should submit answer and update feedback', () => {
    component.sessionId = 'session-123';
    component.questionData = mockQuestions[0];
    component.questionType = 'MC';

    component.onAnswer(['opt1']);

    expect(sessionService.submitAnswer).toHaveBeenCalledWith('session-123', {
      questionType: 'MC',
      questionId: 'q1',
      answerIds: ['opt1']
    });
    expect(component.isCorrect).toBeTrue();
    expect(component.feedback).toBe('Correct!');
  });
});
