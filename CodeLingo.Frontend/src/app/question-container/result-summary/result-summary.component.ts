import { Component, Input } from '@angular/core';
import { SessionSummary } from '../../models/session-summary';

@Component({
  selector: 'app-result-summary',
  standalone: false,
  templateUrl: './result-summary.component.html',
  styleUrl: './result-summary.component.scss'
})
export class ResultSummaryComponent {
  @Input() sessionSummary!: SessionSummary

  answeredPercentage = 0;
  correctPercentage = 0;

  ngOnInit() {
    // Animate progress bars with a delay
    setTimeout(() => {
      this.answeredPercentage = (this.sessionSummary.answeredQuestions / this.sessionSummary.totalQuestions) * 100;
      
      setTimeout(() => {
        this.correctPercentage = (this.sessionSummary.correctAnswers / this.sessionSummary.answeredQuestions) * 100;
      }, 500);
    }, 300);
  }
}
