import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';

@Component({
  selector: 'app-multiple-choice-question',
  standalone: false,
  templateUrl: './multiple-choice-question.component.html',
  styleUrl: './multiple-choice-question.component.scss'
})
export class MultipleChoiceQuestionComponent {

  @Input() question!: MultipleChoiceQuestion;
  @Output() answerSubmitted = new EventEmitter<string[]>();

  // Seed data for testing
  constructor() {
    this.question = {
      "id": "mc-001",
      "type": "MC",
      "language": "csharp",
      "difficulty": "medium",
      "title": "C# String Methods",
      "questionText": "Which method is used to convert a string to uppercase in C#?",
      "explanation": "The ToUpper method converts all characters in a string to uppercase. It returns a new string without modifying the original.",
      "tags": ["strings", "methods", "basics"],
      "options": [
        {
          "id": "opt-1",
          "text": "ToUpper()",
          "order": 1
        },
        {
          "id": "opt-2",
          "text": "UpperCase()",
          "order": 2
        },
        {
          "id": "opt-3",
          "text": "toUpperCase()",
          "order": 3
        },
        {
          "id": "opt-4",
          "text": "Upper()",
          "order": 4
        }
      ],
      "correctAnswerIds": ["opt-1"],
      "allowMultipleSelection": true,
      "shuffleOptions": false,
      "metadata": {
        "version": 1,
        "estimatedTimeSeconds": 30,
        "pointValue": 10,
        "usageCount": 145,
        "averageCorrectRate": 0.82
      },
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z",
      "createdBy": "admin-001",
      "isActive": false

    };
  }

}
