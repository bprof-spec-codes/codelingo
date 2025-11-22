import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../../models/language';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-language-create',
  standalone: false,
  templateUrl: './admin-language-create.component.html',
  styleUrl: './admin-language-create.component.scss'
})
export class AdminLanguageCreateComponent implements OnInit {

  @Output() languageCreated = new EventEmitter<Language>();
  languageForm!: FormGroup;

  constructor(private service: AdminService, private fb: FormBuilder) {

  }
  ngOnInit(): void {
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
}
