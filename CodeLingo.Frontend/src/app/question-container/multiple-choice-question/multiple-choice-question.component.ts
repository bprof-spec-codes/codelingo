import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';
import { AnswerOption } from '../../models/answer-option';

@Component({
  selector: 'app-multiple-choice-question',
  standalone: false,
  templateUrl: './multiple-choice-question.component.html',
  styleUrl: './multiple-choice-question.component.scss',
})
export class MultipleChoiceQuestionComponent implements OnChanges {
  @Input() question!: MultipleChoiceQuestion;
  @Input() isSubmitted: boolean = false;

  @Output() answerSubmitted = new EventEmitter<string[]>();

  // Seed data for testing
  // constructor() {
  //   this.question = {
  //     "id": "mc-001",
  //     "type": "MC",
  //     "language": "csharp",
  //     "difficulty": "medium",
  //     "title": "C# String Methods",
  //     "questionText": "Which method is used to convert a string to uppercase in C#?",
  //     "explanation": "The ToUpper method converts all characters in a string to uppercase. It returns a new string without modifying the original.",
  //     "tags": ["strings", "methods", "basics"],
  //     "options": [
  //       {
  //         "id": "opt-1",
  //         "text": "ToUpper()",
  //         "order": 1,
  //       },
  //       {
  //         "id": "opt-2",
  //         "text": "UpperCase()",
  //         "order": 2
  //       },
  //       {
  //         "id": "opt-3",
  //         "text": "toUpperCase()",
  //         "order": 3
  //       },
  //       {
  //         "id": "opt-4",
  //         "text": "Upper()",
  //         "order": 4
  //       }
  //     ],
  //     "correctAnswerIds": ["opt-1"],
  //     "allowMultipleSelection": true,
  //     "shuffleOptions": false,
  //     "metadata": {
  //       "version": 1,
  //       "estimatedTimeSeconds": 30,
  //       "pointValue": 10,
  //       "usageCount": 145,
  //       "averageCorrectRate": 0.82
  //     },
  //     "createdAt": "2025-01-15T10:00:00Z",
  //     "updatedAt": "2025-01-15T10:00:00Z",
  //     "createdBy": "admin-001",
  //     "isActive": false

  //   };
  // }

  selectedAnswerIds: string[] = [];
  sortedOptions: AnswerOption[] = [];
  previousQuestionId: string | null = null;

  // toggle option selection
  toggleOption(optionId: string): void {
    if (this.isSubmitted) {
      return; // prevent changes after submission
    }

    if (this.question.allowMultipleSelection) {
      // multiple selection mode
      const index = this.selectedAnswerIds.indexOf(optionId);
      if (index > -1) {
        this.selectedAnswerIds.splice(index, 1);
        //console.log('Option deselected:', optionId);
      } else {
        this.selectedAnswerIds.push(optionId);
        //console.log('Option selected:', optionId);
      }
    } else {
      // single selection mode
      this.selectedAnswerIds = [optionId];
      //console.log('Option selected:', optionId);
    }

    //console.log('Currently selected answers:', this.selectedAnswerIds);
  }

  // check if an option is selected
  isOptionSelected(optionId: string): boolean {
    return this.selectedAnswerIds.includes(optionId);
  }

  ngOnChanges() {
    console.log(
      'MultipleChoiceQuestionComponent: question input changed',
      this.question
    );

    if (!this.question || this.previousQuestionId === this.question.id) return;

    this.previousQuestionId = this.question.id;
    this.selectedAnswerIds = [];
    this.isSubmitted = false;
    this.updateSortedOptions();
  }

  // sort and optionally shuffle options
  updateSortedOptions(): void {
    if (!this.question || !this.question.options) {
      console.warn('updateSortedOptions: question or options missing');
      this.sortedOptions = [];
      return;
    }

    const sorted = [...this.question.options].sort((a, b) => a.order - b.order);

    if (this.question.shuffleOptions) {
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }

    console.log('updateSortedOptions set sortedOptions:', sorted);
    this.sortedOptions = sorted;
  }

  // check if submission is allowed
  canSubmit(): boolean {
    return this.selectedAnswerIds.length > 0 && !this.isSubmitted;
  }

  // submit the selected answers
  submitAnswer(): void {
    if (this.canSubmit()) {
      //console.log('Submitting answer(s):', this.selectedAnswerIds);
      this.isSubmitted = true;
      this.answerSubmitted.emit([...this.selectedAnswerIds]);
    }
  }

  resetSelection() {
    this.selectedAnswerIds = [];
    this.isSubmitted = false;
  }

  trackByOptionId(index: number, option: AnswerOption) {
    return option.id;
  }
}
