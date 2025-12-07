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
}
