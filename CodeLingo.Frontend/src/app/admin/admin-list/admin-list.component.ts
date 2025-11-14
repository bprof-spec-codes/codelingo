import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {
  @Input() questions$!: Observable<Question[]>;
  @Output() questionUpdated = new EventEmitter<Question>();
  
onItemUpdated(q: Question) {
  this.questionUpdated.emit(q);
}
  QuestionType = QuestionType
  constructor(private service: AdminService) { }

  onCreateQuestion() {

  }
}
