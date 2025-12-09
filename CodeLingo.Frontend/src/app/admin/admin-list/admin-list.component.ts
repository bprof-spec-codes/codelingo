import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {
  @Input() questions: Question[] = [];
  @Input() languages: Language[] = [];
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();

  QuestionType = QuestionType;

  filters = {
    title: '',
    questionText: '',
    difficulty: '',
    language: ''
  };

  constructor(private service: AdminService) {
  }

  onFilterChange() {
    this.filterChange.emit(this.filters);
  }

  onItemDelete(id: string) {
    this.delete.emit(id);
  }

  onItemUpdated(q: Question) {
    this.questionUpdated.emit(q);
  }

}