import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { Language } from '../../models/language';

const MOCK_LANGUAGES: Language[] = [
  new Language('lang-1', 'TypeScript', '5.6', '2025-01-01T10:00:00Z', '2025-01-10T12:00:00Z'),
  new Language('lang-2', 'JavaScript', 'ES2023', '2025-01-05T09:30:00Z', '2025-01-15T14:20:00Z'),
  new Language('lang-3', 'C#', '12.0', '2025-02-01T08:00:00Z', '2025-02-03T16:45:00Z'),
  new Language('lang-4', 'Python', '3.13', '2025-03-10T11:15:00Z', '2025-03-20T18:30:00Z')
];

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent implements OnInit {
  @Input() questions$!: Observable<Question[]>;
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<string>();

  @Input() languages$!: Observable<Language[]>;

  QuestionType = QuestionType;

  // Szerkesztés állapota
  editingLanguage: Language | null = null;
  editModel: { name: string; version: string } = { name: '', version: '' };

  constructor(private service: AdminService) {}

  ngOnInit(): void {
    // Csak teszteléshez / mockhoz:
    if (!this.languages$) {
      this.languages$ = of(MOCK_LANGUAGES);
    }
  }

  onItemDelete(id: string) {
    this.delete.emit(id);
  }

  onItemUpdated(q: Question) {
    this.questionUpdated.emit(q);
  }

  // Edit gomb
  onEdit(lang: Language) {
    this.editingLanguage = { ...lang }; // másolat
    this.editModel = {
      name: lang.name,
      version: lang.version
    };
  }

  // Mentés gomb
  onSaveEdit() {
    if (!this.editingLanguage) {
      return;
    }

    const updated: Language = {
      ...this.editingLanguage,
      name: this.editModel.name,
      version: this.editModel.version
      // updatedAt-et majd a backend adja vissza
    };

    // Itt kéne meghívni a PUT /admin/languages/{id}-t:
    // this.service.updateLanguage(updated).subscribe(...)

    console.log('Saving language:', updated);

    // Egyszerűen bezárjuk az edit módot
    this.editingLanguage = null;
  }

  // Mégse
  onCancelEdit() {
    this.editingLanguage = null;
  }

  // Törlés
  onDelete(lang: Language) {
    console.log('Delete language:', lang);
    // Itt jönne a DELETE /admin/languages/{id}
    // this.service.deleteLanguage(lang.id).subscribe(...)
  }
}