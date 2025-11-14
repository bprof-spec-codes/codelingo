import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question, MultipleChoiceQuestion, CodeCompletionQuestion, QuestionType } from '../../models/question';

@Component({
  selector: 'app-admin-item',
  standalone: false,
  templateUrl: './admin-item.component.html',
  styleUrl: './admin-item.component.scss'
})
export class AdminItemComponent {
  @Input() question!: Question;
  @Output() questionUpdated = new EventEmitter<Question>();
  QuestionType = QuestionType;
  showDetails = false;
  editing = false; // szerkesztési állapot
  startEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }
onSave(updatedQuestion: Question) {
    this.editing = false;
    this.questionUpdated.emit(updatedQuestion); // értesíti a szülőt
  }
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  constructor() { }
  get mcQuestion(): MultipleChoiceQuestion | null {
    return this.question.type === QuestionType.MultipleChoice
      ? (this.question as MultipleChoiceQuestion)
      : null;
  }

  get ccQuestion(): CodeCompletionQuestion | null {
    return this.question.type === QuestionType.CodeCompletion
      ? (this.question as CodeCompletionQuestion)
      : null;
  }
}
