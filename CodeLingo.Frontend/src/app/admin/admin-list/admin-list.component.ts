import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';
@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent implements OnInit {
  @Input() questions$!: Observable<Question[]>;
  languages$!: Observable<Language[]>;
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<string>();


  QuestionType = QuestionType;

  editingLanguage: Language | null = null;
  editModel: { name: string; version: string } = { name: '', version: '' };

  constructor(private service: AdminService) { }

  ngOnInit(): void {
    this.languages$=this.service.getLanguages()
  }

  onItemDelete(id: string) {
    this.delete.emit(id);
  }

  onItemUpdated(q: Question) {
    this.questionUpdated.emit(q);
  }

  onEdit(lang: Language) {
    this.editingLanguage = { ...lang }; // másolat
    this.editModel = {
      name: lang.name,
      version: lang.version
    };
  }
  onSaveEdit() {
    if (!this.editingLanguage) {
      return;
    }

    const id = this.editingLanguage.id

    const payload = {
      name: this.editModel.name,
      version: this.editModel.version
    };

    this.service.updateLanguage(id, payload).subscribe({
      next: (updated) => {
        console.log('Language updated:', updated)
        this.editingLanguage = null
      },
      error: (err) => {
        console.error('Language update failed', err)
        // hiba
      },
      complete: () => {

      }
    });
  }

  // Mégse
  onCancelEdit() {
    this.editingLanguage = null;
  }

  // Törlés
  onDelete(lang: Language) {
    console.log('Delete language:', lang)
    // Itt jönne a DELETE /admin/languages/{id}
    // this.service.deleteLanguage(lang.id).subscribe(...)
  }
}