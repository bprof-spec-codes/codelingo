import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';

@Component({
  selector: 'app-mc-question-editor',
  standalone: false,
  templateUrl: './mc-question-editor.component.html',
  styleUrl: './mc-question-editor.component.scss'
})
export class McQuestionEditorComponent {

  @Input() existingQuestion?: MultipleChoiceQuestion;
  @Input() languages: string[] = [];
  @Input() difficulties: string[] = [];
  
  @Output() questionSubmitted = new EventEmitter<MultipleChoiceQuestion>();
  @Output() cancelled = new EventEmitter<void>();

  

}
