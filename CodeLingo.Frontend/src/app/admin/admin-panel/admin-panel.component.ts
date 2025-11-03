import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../../models/question';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  questions$!: Observable<Question[]>;
  selectedQuestion: Partial<Question> | null = null;
  selectedFile: File | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    //this.loadQuestions();
    this.loadMockQuestions()
  }
  
  loadQuestions(): void {
    this.questions$ = this.adminService.getQuestions();
  } 
  editQuestion(q: Question): void {
    this.selectedQuestion = { ...q }
  }
loadMockQuestions(): void {
  const mockData: Question[] = [
    {
      id: '1',
      title: 'Első kérdés',
      questionText: 'Mi a JavaScript?',
      language: 'JavaScript',
      difficulty: 'easy',
      type: 'multiple_choice',
      explanation: 'Alapfogalom',
      tags: 'js,programming',
      metadata: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '2',
      title: 'Második kérdés',
      questionText: 'Mi az Angular?',
      language: 'TypeScript',
      difficulty: 'medium',
      type: 'multiple_choice',
      explanation: 'Framework',
      tags: 'angular,ts',
      metadata: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: false
    }
  ];

  this.questions$ = of(mockData);
}
createQuestion(): void {
    this.selectedQuestion = {
      title: '',
      questionText: '',
      language: '',
      difficulty: '',
      type: '',
      explanation: '',
      tags: '',
      metadata: '',
      createdBy: '',
      isActive: true
    };
  }

  saveQuestion(): void {
    if (!this.selectedQuestion) return;

    const obs$ = this.selectedQuestion.id
      ? this.adminService.updateQuestion(this.selectedQuestion.id, this.selectedQuestion)
      : this.adminService.createQuestion(this.selectedQuestion);

    obs$.subscribe({
      next: () => {
        this.selectedQuestion = null;
        this.loadQuestions();
      },
      error: () => alert('Nem sikerült a mentés.')
    });
  }

  cancelEdit(): void {
    this.selectedQuestion = null;
  }

  deleteQuestion(id: string): void {
    if (!confirm('Biztosan törölni szeretnéd ezt a kérdést?')) return;

    this.adminService.deleteQuestion(id).subscribe({
      next: () => this.loadQuestions(),
      error: () => alert('Nem sikerült a törlés.')
    });
  }
  
  //Import/Export

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
    /** CSV/Aiken importálás */
  importQuestions(format?: 'csv' | 'aiken') {
    if (!this.selectedFile) return;

    this.adminService.importQuestions(this.selectedFile, format).subscribe({
      next: (res) => {
        console.log('Import response:', res);
        // újra lekérhetjük a listát import után
        this.questions$ = this.adminService.getQuestions();
      },
      error: (err) => console.error('Import error:', err)
    });
  }

  /** Kérdések exportálása */
  exportQuestions(format: 'csv' | 'json' | 'aiken' = 'json') {
    this.adminService.exportQuestions({ format }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `questions.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Export error:', err)
    });
  }
}
