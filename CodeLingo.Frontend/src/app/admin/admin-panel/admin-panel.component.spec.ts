import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminService } from '../../services/admin.service';
import { Question } from '../../models/question';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  const mockQuestions: Question[] = [
    {
      id: '1',
      title: 'Első kérdés',
      questionText: 'Mi a JavaScript?',
      language: 'JavaScript',
      difficulty: 'easy',
      type: 'multiple_choice',
      explanation: 'Alapfogalom',
      tags: 'js,programming',
      metadata: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '2',
      title: 'Második kérdés',
      questionText: 'Mi az Angular?',
      language: 'TypeScript',
      difficulty: 'medium',
      type: 'multiple_choice',
      explanation: 'Framework',
      tags: 'angular,ts',
      metadata: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: false
    }
  ];

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', [
      'getQuestions',
      'createQuestion',
      'updateQuestion',
      'deleteQuestion',
      'importQuestions',
      'exportQuestions'
    ]);

await TestBed.configureTestingModule({
    declarations: [AdminPanelComponent],
    imports: [HttpClientTestingModule],
    providers: [
      { provide: AdminService, useValue: mockAdminService }
    ]
  }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load mock questions on init', () => {
      component.ngOnInit();
      
      component.questions$.subscribe(questions => {
        expect(questions.length).toBe(2);
        expect(questions[0].title).toBe('Első kérdés');
        expect(questions[1].title).toBe('Második kérdés');
      });
    });
  });

  describe('loadQuestions', () => {
    it('should load questions from service', () => {
      mockAdminService.getQuestions.and.returnValue(of(mockQuestions));
      
      component.loadQuestions();
      
      expect(mockAdminService.getQuestions).toHaveBeenCalled();
      component.questions$.subscribe(questions => {
        expect(questions).toEqual(mockQuestions);
      });
    });
  });

  describe('editQuestion', () => {
    it('should set selectedQuestion with copied question', () => {
      const questionToEdit = mockQuestions[0];
      
      component.editQuestion(questionToEdit);
      
      expect(component.selectedQuestion).toEqual({ ...questionToEdit });
      expect(component.selectedQuestion).not.toBe(questionToEdit); // ellenőrizzük, hogy másolat
    });
  });

  describe('createQuestion', () => {
    it('should initialize empty selectedQuestion', () => {
      component.createQuestion();
      
      expect(component.selectedQuestion).toEqual({
        title: '',
        questionText: '',
        language: '',
        difficulty: '',
        type: '',
        explanation: '',
        tags: '',
        metadata: '',
        createdBy: '',
        isActive: true
      });
    });
  });

  describe('cancelEdit', () => {
    it('should reset selectedQuestion to null', () => {
      component.selectedQuestion = mockQuestions[0];
      
      component.cancelEdit();
      
      expect(component.selectedQuestion).toBeNull();
    });
  });

  describe('saveQuestion', () => {
    beforeEach(() => {
      mockAdminService.createQuestion.and.returnValue(of({} as Question));
      mockAdminService.updateQuestion.and.returnValue(of({} as Question));
      mockAdminService.getQuestions.and.returnValue(of(mockQuestions));
    });

    it('should not save if selectedQuestion is null', () => {
      component.selectedQuestion = null;
      
      component.saveQuestion();
      
      expect(mockAdminService.createQuestion).not.toHaveBeenCalled();
      expect(mockAdminService.updateQuestion).not.toHaveBeenCalled();
    });

    
    
  });

  describe('deleteQuestion', () => {
    beforeEach(() => {
      // A deleteQuestion metódus void Observable-t ad vissza
      mockAdminService.deleteQuestion.and.returnValue(of(undefined));
      mockAdminService.getQuestions.and.returnValue(of(mockQuestions));
      spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should delete question when confirmed', () => {
      component.deleteQuestion('1');
      
      expect(mockAdminService.deleteQuestion).toHaveBeenCalledWith('1');
      expect(mockAdminService.getQuestions).toHaveBeenCalled();
    });

    it('should not delete question when not confirmed', () => {
      (window.confirm as jasmine.Spy).and.returnValue(false);
      
      component.deleteQuestion('1');
      
      expect(mockAdminService.deleteQuestion).not.toHaveBeenCalled();
    });
  });

  describe('file operations', () => {
    it('should set selectedFile when file is selected', () => {
      const mockFile = new File([''], 'test.csv');
      const mockEvent = { target: { files: [mockFile] } };
      
      component.onFileSelected(mockEvent);
      
      expect(component.selectedFile).toBe(mockFile);
    });

    it('should not set selectedFile when no file is selected', () => {
      const mockEvent = { target: { files: [] } };
      
      component.onFileSelected(mockEvent);
      
      expect(component.selectedFile).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle save error', () => {
      mockAdminService.createQuestion.and.returnValue(throwError(() => new Error('Hiba')));
      spyOn(window, 'alert');
      
      component.selectedQuestion = {
        title: 'Új kérdés',
        questionText: 'Új kérdés szöveg',
        language: 'JavaScript',
        difficulty: 'easy',
        type: 'multiple_choice',
        explanation: '',
        tags: '',
        metadata: '',
        createdBy: 'admin',
        isActive: true
      };

      component.saveQuestion();
      
      expect(window.alert).toHaveBeenCalledWith('Nem sikerült a mentés.');
    });

    it('should handle delete error', () => {
      mockAdminService.deleteQuestion.and.returnValue(throwError(() => new Error('Hiba')));
      spyOn(window, 'alert');
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.deleteQuestion('1');
      
      expect(window.alert).toHaveBeenCalledWith('Nem sikerült a törlés.');
    });
  });
});