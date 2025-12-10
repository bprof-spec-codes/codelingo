import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Output() delete = new EventEmitter<string>();

  @ViewChild('itemRow') itemRow!: ElementRef;

  QuestionType = QuestionType;
  showDetails = false;

  constructor() { }

  toggleExpand() {
    this.showDetails = !this.showDetails;
    if (this.showDetails) {
      setTimeout(() => {
        this.itemRow.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }

  deleteItem() {
    this.delete.emit(this.question.id);
  }

  onSave(updatedQuestion: Question) {
    // We can keep it open or close it. Closng it for now as per previous behavior.
    this.showDetails = false;
    this.questionUpdated.emit(updatedQuestion);
  }
}
