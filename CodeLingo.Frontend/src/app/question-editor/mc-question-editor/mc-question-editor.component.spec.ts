import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { McQuestionEditorComponent } from './mc-question-editor.component';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';

describe('McQuestionEditorComponent', () => {
  let component: McQuestionEditorComponent;
  let fixture: ComponentFixture<McQuestionEditorComponent>;

  const mockQuestion: MultipleChoiceQuestion = {
    id: 'mc-001',
    type: 'mc',
    language: 'javascript',
    difficulty: 'medium',
    title: 'Test Question',
    questionText: 'What is JavaScript?',
    explanation: 'JavaScript is a programming language.',
    tags: ['basics', 'javascript'],
    options: [
      { id: 'opt-1', text: 'Option 1', order: 1 },
      { id: 'opt-2', text: 'Option 2', order: 2 }
    ],
    correctAnswerIds: ['opt-1'],
    allowMultipleSelection: false,
    shuffleOptions: false,
    metadata: {
      version: 1,
      estimatedTimeSeconds: 30,
      pointValue: 10,
      usageCount: 0,
      averageCorrectRate: 0
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'test-user',
    isActive: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [McQuestionEditorComponent],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McQuestionEditorComponent);
    component = fixture.componentInstance;
    component.languages = ['javascript', 'python', 'csharp'];
    component.difficulties = ['easy', 'medium', 'hard'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with required controls', () => {
      component.ngOnInit();
      expect(component.questionForm).toBeDefined();
      expect(component.questionForm.get('title')).toBeDefined();
      expect(component.questionForm.get('language')).toBeDefined();
      expect(component.questionForm.get('difficulty')).toBeDefined();
    });

    it('should initialize new question with 2 empty options', () => {
      component.ngOnInit();
      expect(component.options.length).toBe(2);
    });

    it('should load existing question data', () => {
      component.existingQuestion = mockQuestion;
      component.ngOnInit();
      expect(component.questionForm.get('title')?.value).toBe('Test Question');
      expect(component.options.length).toBe(2);
    });
  });

  describe('Option Management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should add new option', () => {
      const initialLength = component.options.length;
      component.addNewOption();
      expect(component.options.length).toBe(initialLength + 1);
    });

    it('should remove option when more than 2 exist', () => {
      component.addNewOption();
      const initialLength = component.options.length;
      component.removeOption(0);
      expect(component.options.length).toBe(initialLength - 1);
    });

    it('should not remove option when only 2 exist', () => {
      component.removeOption(0);
      expect(component.options.length).toBe(2);
    });

    it('should move option up', () => {
      component.options.at(0).patchValue({ text: 'First' });
      component.options.at(1).patchValue({ text: 'Second' });
      component.moveOptionUp(1);
      expect(component.options.at(0).get('text')?.value).toBe('Second');
    });

    it('should not move first option up', () => {
      component.options.at(0).patchValue({ text: 'First' });
      component.moveOptionUp(0);
      expect(component.options.at(0).get('text')?.value).toBe('First');
    });

    it('should move option down', () => {
      component.options.at(0).patchValue({ text: 'First' });
      component.options.at(1).patchValue({ text: 'Second' });
      component.moveOptionDown(0);
      expect(component.options.at(1).get('text')?.value).toBe('First');
    });

    it('should update orders after reordering', () => {
      component.updateOrders();
      expect(component.options.at(0).get('order')?.value).toBe(1);
      expect(component.options.at(1).get('order')?.value).toBe(2);
    });
  });

  describe('Correct Answer Selection', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should toggle correct answer in single selection mode', () => {
      component.questionForm.patchValue({ allowMultipleSelection: false });
      component.toggleCorrectAnswer(0);
      expect(component.options.at(0).get('isCorrect')?.value).toBe(true);
    });

    it('should uncheck other options in single selection mode', () => {
      component.questionForm.patchValue({ allowMultipleSelection: false });
      component.toggleCorrectAnswer(0);
      component.toggleCorrectAnswer(1);
      expect(component.options.at(0).get('isCorrect')?.value).toBe(false);
      expect(component.options.at(1).get('isCorrect')?.value).toBe(true);
    });

    it('should allow multiple selections in multiple selection mode', () => {
      component.questionForm.patchValue({ allowMultipleSelection: true });
      component.toggleCorrectAnswer(0);
      component.toggleCorrectAnswer(1);
      expect(component.options.at(0).get('isCorrect')?.value).toBe(true);
      expect(component.options.at(1).get('isCorrect')?.value).toBe(true);
    });

    it('should clear all correct answers when switching to single selection', () => {
      component.questionForm.patchValue({ allowMultipleSelection: true });
      component.toggleCorrectAnswer(0);
      component.toggleCorrectAnswer(1);
      component.questionForm.patchValue({ allowMultipleSelection: false });
      expect(component.options.at(0).get('isCorrect')?.value).toBe(false);
      expect(component.options.at(1).get('isCorrect')?.value).toBe(false);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should be invalid when required fields are empty', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('should be invalid when no correct answer selected', () => {
      component.questionForm.patchValue({
        title: 'Test',
        language: 'javascript',
        difficulty: 'easy',
        questionText: 'Question',
        explanation: 'Explanation'
      });
      expect(component.isFormValid()).toBe(false);
    });

    it('should be valid when all required fields filled and correct answer selected', () => {
      component.questionForm.patchValue({
        title: 'Test',
        language: 'javascript',
        difficulty: 'easy',
        questionText: 'Question',
        explanation: 'Explanation',
        estimatedTimeSeconds: 30
      });
      component.options.at(0).patchValue({ text: 'Option 1' });
      component.options.at(1).patchValue({ text: 'Option 2' });
      component.toggleCorrectAnswer(0);
      expect(component.isFormValid()).toBe(true);
    });

    it('should get correct answer IDs', () => {
      component.options.at(0).patchValue({ isCorrect: true, id: 'opt-1' });
      const ids = component.getCorrectAnswerIds();
      expect(ids).toContain('opt-1');
    });
  });

  describe('Tag Parsing', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should parse comma-separated tags', () => {
      component.questionForm.patchValue({ tagsInput: 'tag1, tag2, tag3' });
      const tags = component.parseTags();
      expect(tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle empty tags input', () => {
      component.questionForm.patchValue({ tagsInput: '' });
      const tags = component.parseTags();
      expect(tags).toEqual([]);
    });

    it('should trim whitespace from tags', () => {
      component.questionForm.patchValue({ tagsInput: '  tag1  ,  tag2  ' });
      const tags = component.parseTags();
      expect(tags).toEqual(['tag1', 'tag2']);
    });
  });

  describe('Question Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
      spyOn(component.questionSubmitted, 'emit');
    });

    it('should not submit invalid form', () => {
      spyOn(window, 'alert');
      component.submitQuestion();
      expect(component.questionSubmitted.emit).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('should emit question on valid submission', () => {
      component.questionForm.patchValue({
        title: 'Test',
        language: 'javascript',
        difficulty: 'easy',
        questionText: 'Question',
        explanation: 'Explanation',
        estimatedTimeSeconds: 30
      });
      component.options.at(0).patchValue({ text: 'Option 1' });
      component.options.at(1).patchValue({ text: 'Option 2' });
      component.toggleCorrectAnswer(0);
      
      component.submitQuestion();
      expect(component.questionSubmitted.emit).toHaveBeenCalled();
    });
  });

  describe('Cancel Action', () => {
    it('should emit cancelled event', () => {
      component.ngOnInit();
      spyOn(component.cancelled, 'emit');
      component.cancel();
      expect(component.cancelled.emit).toHaveBeenCalled();
    });
  });

  describe('ID Generation', () => {
    it('should generate unique question ID', () => {
      const id1 = component.generateId();
      const id2 = component.generateId();
      expect(id1).toContain('mc-');
      expect(id1).not.toBe(id2);
    });

    it('should generate unique option ID', () => {
      const id1 = component.generateOptionId();
      const id2 = component.generateOptionId();
      expect(id1).toContain('opt-');
      expect(id1).not.toBe(id2);
    });
  });
});
