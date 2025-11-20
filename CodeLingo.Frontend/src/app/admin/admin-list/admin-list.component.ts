import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {
  @Input() questions$!: Observable<Question[]>;
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<string>();
  @Input() languages$!: Observable<Language[]>;
  onItemDelete(id: string) {
    this.delete.emit(id);
  }
  onItemUpdated(q: Question) {
    this.questionUpdated.emit(q);
  }
  QuestionType = QuestionType
  constructor(private service: AdminService) { }

  onEdit(lang: Language) {
    // form megnyitása, modal, route, stb.
  }

  onDelete(lang: Language) {
    // confirm + DELETE /admin/languages/{id}
  }
}
