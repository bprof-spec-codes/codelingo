import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminService } from '../../services/admin.service';
import {
  Question,
  QuestionType,
  MultipleChoiceQuestion
} from '../../models/question';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountUpModule } from 'ngx-countup';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj<AdminService>(
      'AdminService',
      ['getQuestions', 'updateQuestion', 'deleteQuestion', 'createQuestion']
    );

    mockAdminService.getQuestions.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AdminPanelComponent],
      imports: [HttpClientTestingModule, CountUpModule],
      providers: [{ provide: AdminService, useValue: mockAdminService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mock questions on init', (done) => {
    component.ngOnInit();

    component.questions$.subscribe((questions: Question[]) => {
      expect(questions).toBeTruthy();
      expect(questions.length).toBe(3);

      expect(questions[0].id).toBe('1');
      expect(questions[0].type).toBe(QuestionType.MultipleChoice);
      expect(questions[1].type).toBe(QuestionType.CodeCompletion);

      done();
    });
  });

  it('should call AdminService.updateQuestion on onQuestionUpdated', () => {
    const updatedQuestion: MultipleChoiceQuestion = {
      id: '123',
      type: QuestionType.MultipleChoice,
      language: 'TS',
      difficulty: 'easy',
      title: 't',
      questionText: 'q',
      explanation: 'e',
      tags: [],
      metadata: { category: '', topic: '', source: '' },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test',
      isActive: true,
      options: [
        { text: 'a', isCorrect: true },
        { text: 'b', isCorrect: false }
      ],
      allowMultipleSelection: false,
      shuffleOptions: false
    };

    component.onQuestionUpdated(updatedQuestion);

    expect(mockAdminService.updateQuestion).toHaveBeenCalledWith(
      '123',
      updatedQuestion
    );
  });

  it('should call AdminService.deleteQuestion and createQuestion', () => {
    const id = '456';

    const createdQuestion: MultipleChoiceQuestion = {
      id: '789',
      type: QuestionType.MultipleChoice,
      language: 'TS',
      difficulty: 'medium',
      title: 'new',
      questionText: 'q',
      explanation: 'e',
      tags: [],
      metadata: { category: '', topic: '', source: '' },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test',
      isActive: true,
      options: [
        { text: 'a', isCorrect: true },
        { text: 'b', isCorrect: false }
      ],
      allowMultipleSelection: false,
      shuffleOptions: true
    };

    component.onQuestionDelete(id);
    component.onQuestionCreated(createdQuestion);

    expect(mockAdminService.deleteQuestion).toHaveBeenCalledWith(id);
    expect(mockAdminService.createQuestion).toHaveBeenCalledWith(createdQuestion);
  });
});