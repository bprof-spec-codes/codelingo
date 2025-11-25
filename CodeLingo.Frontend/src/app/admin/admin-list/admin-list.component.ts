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
export class AdminListComponent implements OnInit {
  @Input() questions$!: Observable<Question[]>;
  languages$!: Observable<Language[]>;
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<string>();
  languageForm!: FormGroup;
  QuestionType = QuestionType;

  editingLanguage: Language | null = null;
  editModel: { name: string; version: string } = { name: '', version: '' };

  constructor(private service: AdminService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.languages$ = this.service.getLanguages()

    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      version: ['', Validators.required]
    });
  }
  onCreateLanguage(): void {
    if (this.languageForm.invalid) {
      this.languageForm.markAllAsTouched();
      return;
    }
    
    const newLanguage = this.languageForm.value;

    this.service.addLanguage(newLanguage).subscribe({
      next: () => {
        this.languageForm.reset();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onItemDelete(id: string) {
    this.delete.emit(id);
  }

  onItemUpdated(q: Question) {
    this.questionUpdated.emit(q);
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