import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../../models/language';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-language-list',
  standalone: false,
  templateUrl: './admin-language-list.component.html',
  styleUrl: './admin-language-list.component.scss'
})
export class AdminLanguageListComponent {
  languages$!: Observable<Language[]>;
  editingLanguage: Language | null = null;
  editModel: { name: string; version: string } = { name: '', version: '' };
  constructor(private service: AdminService) {

  }
  ngOnInit(): void {
    this.languages$ = this.service.getLanguages()
  }
  onEdit(lang: Language) {
    this.editingLanguage = { ...lang };
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
      },
      complete: () => {

      }
    });
  }

  onCancelEdit() {
    this.editingLanguage = null;
  }
  onDelete(lang: Language) {
    console.log('Delete language:', lang)
    this.service.deleteLanguage(lang.id).subscribe()
  }
}
