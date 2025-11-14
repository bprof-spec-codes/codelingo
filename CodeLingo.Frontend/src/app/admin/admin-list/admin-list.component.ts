import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, QuestionType } from '../../models/question';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {
  @Input() questions$!: Observable<Question[]>;
  QuestionType = QuestionType
  constructor(){}

  onCreateQuestion() {
    
}
}
