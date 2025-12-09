import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-progress',
  standalone: false,
  templateUrl: './question-progress.component.html',
  styleUrls: ['./question-progress.component.scss'],
})
export class QuestionProgressComponent {
  @Input() currentIndex: number = 1;
  @Input() totalQuestions: number = 1;
  @Input() currentScore: number = 0;
}