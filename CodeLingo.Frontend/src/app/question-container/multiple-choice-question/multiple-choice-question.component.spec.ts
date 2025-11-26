import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';
import { AnswerOption } from '../../models/answer-option';
import { CommonModule } from '@angular/common';

describe('MultipleChoiceQuestionComponent', () => {
  let component: MultipleChoiceQuestionComponent;
  let fixture: ComponentFixture<MultipleChoiceQuestionComponent>;

  const mockOptions: AnswerOption[] = [
    { id: 'opt-1', text: 'Option 1', order: 1 },
    { id: 'opt-2', text: 'Option 2', order: 2 },
    { id: 'opt-3', text: 'Option 3', order: 3 },
    { id: 'opt-4', text: 'Option 4', order: 4 }
  ];

  const mockQuestion: MultipleChoiceQuestion = {
    id: 'mc-001',
    type: 'MC',
    language: 'csharp',
    difficulty: 'medium',
    title: 'C# String Methods',
    questionText: 'Which method is used to convert a string to uppercase in C#?',
    explanation: 'The ToUpper method converts all characters in a string to uppercase.',
    tags: ['strings', 'methods', 'basics'],
    options: mockOptions,
    correctAnswerIds: ['opt-1'],
    allowMultipleSelection: false,
    shuffleOptions: false,
    metadata: {
      version: 1,
      estimatedTimeSeconds: 30,
      pointValue: 10,
      usageCount: 145,
      averageCorrectRate: 0.82
    },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin-001',
    isActive: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceQuestionComponent],
      imports: [CommonModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceQuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with empty selectedAnswerIds', () => {
      expect(component.selectedAnswerIds).toEqual([]);
    });

    it('should initialize with isSubmitted as false', () => {
      expect(component.isSubmitted).toBe(false);
    });
  });

  describe('toggleOption - Single Selection Mode', () => {
    beforeEach(() => {
      component.question = { ...mockQuestion, allowMultipleSelection: false };
      component.isSubmitted = false;
      component.selectedAnswerIds = [];
    });

    it('should select an option in single selection mode', () => {
      component.toggleOption('opt-1');
      expect(component.selectedAnswerIds).toEqual(['opt-1']);
    });

    it('should replace previous selection with new selection in single selection mode', () => {
      component.toggleOption('opt-1');
      component.toggleOption('opt-2');
      expect(component.selectedAnswerIds).toEqual(['opt-2']);
      expect(component.selectedAnswerIds.length).toBe(1);
    });

    it('should not allow changes after submission in single selection mode', () => {
      component.toggleOption('opt-1');
      component.isSubmitted = true;
      component.toggleOption('opt-2');
      expect(component.selectedAnswerIds).toEqual(['opt-1']);
    });
  });

  describe('toggleOption - Multiple Selection Mode', () => {
    beforeEach(() => {
      component.question = { ...mockQuestion, allowMultipleSelection: true };
      component.isSubmitted = false;
      component.selectedAnswerIds = [];
    });

    it('should select multiple options in multiple selection mode', () => {
      component.toggleOption('opt-1');
      component.toggleOption('opt-2');
      expect(component.selectedAnswerIds).toEqual(['opt-1', 'opt-2']);
    });

    it('should deselect an option when clicked again in multiple selection mode', () => {
      component.toggleOption('opt-1');
      component.toggleOption('opt-2');
      component.toggleOption('opt-1');
      expect(component.selectedAnswerIds).toEqual(['opt-2']);
    });

    it('should select all options if needed in multiple selection mode', () => {
      component.toggleOption('opt-1');
      component.toggleOption('opt-2');
      component.toggleOption('opt-3');
      component.toggleOption('opt-4');
      expect(component.selectedAnswerIds).toEqual(['opt-1', 'opt-2', 'opt-3', 'opt-4']);
    });

    it('should not allow changes after submission in multiple selection mode', () => {
      component.toggleOption('opt-1');
      component.isSubmitted = true;
      component.toggleOption('opt-2');
      expect(component.selectedAnswerIds).toEqual(['opt-1']);
    });
  });

  describe('isOptionSelected', () => {
    beforeEach(() => {
      component.question = mockQuestion;
      component.selectedAnswerIds = ['opt-1', 'opt-3'];
    });

    it('should return true for selected options', () => {
      expect(component.isOptionSelected('opt-1')).toBe(true);
      expect(component.isOptionSelected('opt-3')).toBe(true);
    });

    it('should return false for unselected options', () => {
      expect(component.isOptionSelected('opt-2')).toBe(false);
      expect(component.isOptionSelected('opt-4')).toBe(false);
    });
  });

  describe('sortedOptions', () => {
    beforeEach(() => {
      component.question = {
        ...mockQuestion,
        options: [
          { id: 'opt-3', text: 'Option 3', order: 3 },
          { id: 'opt-1', text: 'Option 1', order: 1 },
          { id: 'opt-4', text: 'Option 4', order: 4 },
          { id: 'opt-2', text: 'Option 2', order: 2 }
        ]
      };
    });

    it('should return options sorted by order when shuffleOptions is false', () => {
      component.question.shuffleOptions = false;
      component.updateSortedOptions(); // Call update method
      const sorted = component.sortedOptions; // Access property
      expect(sorted[0].id).toBe('opt-1');
      expect(sorted[1].id).toBe('opt-2');
      expect(sorted[2].id).toBe('opt-3');
      expect(sorted[3].id).toBe('opt-4');
    });

    it('should return all options when shuffleOptions is true', () => {
      component.question.shuffleOptions = true;
      component.updateSortedOptions(); // Call update method
      const sorted = component.sortedOptions; // Access property
      expect(sorted.length).toBe(4);
      // Check that all options are present
      const ids = sorted.map(opt => opt.id).sort();
      expect(ids).toEqual(['opt-1', 'opt-2', 'opt-3', 'opt-4']);
    });

    it('should not modify the original options array', () => {
      const originalOptions = [...component.question.options];
      component.updateSortedOptions(); // Call update method
      expect(component.question.options).toEqual(originalOptions);
    });
  });

  describe('canSubmit', () => {
    beforeEach(() => {
      component.question = mockQuestion;
      component.isSubmitted = false;
    });

    it('should return false when no options are selected', () => {
      component.selectedAnswerIds = [];
      expect(component.canSubmit()).toBe(false);
    });

    it('should return true when at least one option is selected and not submitted', () => {
      component.selectedAnswerIds = ['opt-1'];
      expect(component.canSubmit()).toBe(true);
    });

    it('should return false when already submitted', () => {
      component.selectedAnswerIds = ['opt-1'];
      component.isSubmitted = true;
      expect(component.canSubmit()).toBe(false);
    });

    it('should return false when no selection and already submitted', () => {
      component.selectedAnswerIds = [];
      component.isSubmitted = true;
      expect(component.canSubmit()).toBe(false);
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      component.question = mockQuestion;
      component.isSubmitted = false;
      spyOn(component.answerSubmitted, 'emit');
    });

    it('should emit selected answers when submission is allowed', () => {
      component.selectedAnswerIds = ['opt-1'];
      component.submitAnswer();
      expect(component.answerSubmitted.emit).toHaveBeenCalledWith(['opt-1']);
    });

    it('should set isSubmitted to true after submission', () => {
      component.selectedAnswerIds = ['opt-1'];
      component.submitAnswer();
      expect(component.isSubmitted).toBe(true);
    });

    it('should not emit when no options are selected', () => {
      component.selectedAnswerIds = [];
      component.submitAnswer();
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should not emit when already submitted', () => {
      component.selectedAnswerIds = ['opt-1'];
      component.isSubmitted = true;
      component.submitAnswer();
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should emit a copy of selected answers array', () => {
      component.selectedAnswerIds = ['opt-1', 'opt-2'];
      component.submitAnswer();
      const emittedValue = (component.answerSubmitted.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedValue).toEqual(['opt-1', 'opt-2']);
      expect(emittedValue).not.toBe(component.selectedAnswerIds);
    });
  });

  describe('Input and Output', () => {
    it('should accept question as input', () => {
      component.question = mockQuestion;
      fixture.detectChanges();
      expect(component.question).toEqual(mockQuestion);
    });

    it('should have answerSubmitted output emitter', () => {
      expect(component.answerSubmitted).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle question with single option', () => {
      component.question = {
        ...mockQuestion,
        options: [{ id: 'opt-1', text: 'Only Option', order: 1 }]
      };
      component.toggleOption('opt-1');
      expect(component.selectedAnswerIds).toEqual(['opt-1']);
    });

    it('should handle rapid option toggling in multiple selection mode', () => {
      component.question = { ...mockQuestion, allowMultipleSelection: true };
      component.toggleOption('opt-1');
      component.toggleOption('opt-1');
      component.toggleOption('opt-1');
      expect(component.selectedAnswerIds).toEqual(['opt-1']);
    });

    it('should handle options with imageUrl', () => {
      const optionsWithImages: AnswerOption[] = [
        { id: 'opt-1', text: 'Option 1', order: 1, imageUrl: 'http://example.com/img1.png' },
        { id: 'opt-2', text: 'Option 2', order: 2, imageUrl: 'http://example.com/img2.png' }
      ];
      component.question = { ...mockQuestion, options: optionsWithImages };
      component.updateSortedOptions();
      const sorted = component.sortedOptions;
      expect(sorted[0].imageUrl).toBe('http://example.com/img1.png');
    });
  });
});
