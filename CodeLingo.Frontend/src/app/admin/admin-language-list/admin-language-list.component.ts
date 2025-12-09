import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../../models/language';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-language-list',
  standalone: false,
  templateUrl: './admin-language-list.component.html',
  styleUrl: './admin-language-list.component.scss'
})
export class AdminLanguageListComponent {
  languages$!: Observable<Language[]>;
  editingLanguage: Language | null = null;
  editModel: { name: string; version: string; shortCode: string } = { name: '', version: '', shortCode: '' };
  constructor(private service: AdminService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.languages$ = this.service.getLanguages()
  }
  onEdit(lang: Language) {
    this.editingLanguage = { ...lang };
    this.editModel = {
      name: lang.name,
      version: lang.version,
      shortCode: lang.shortCode
    };
  }
  onSaveEdit() {
    if (!this.editingLanguage) {
      return;
    }
    const id = this.editingLanguage.id
    const payload = {
      name: this.editModel.name,
      version: this.editModel.version,
      shortCode: this.editModel.shortCode
    };

    this.service.updateLanguage(id, payload).subscribe({
      next: (updated) => {
        this.toastr.success("Success", "Updated language successfully");
        console.log('Language updated:', updated)
        this.editingLanguage = null
      },
      error: (err) => {
        this.toastr.error("Failed", "Updated language failed");
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
    this.service.deleteLanguage(lang.id).subscribe({
      next: () => {
        this.toastr.success("Success", "Deleted language successfully");
      },
      error: () => {
        this.toastr.error("Failed", "Deleted language failed");
      },
    })
  }
}
