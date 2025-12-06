import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Question, MultipleChoiceQuestion, CodeCompletionQuestion, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})


export class AdminPanelComponent implements OnInit {
  questions: Question[] = [];
  @Input() question!: Question;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Statistics
  totalQuestionsCount = 0;
  totalUsersCount = 0;
  sessionsThisWeekCount = 0;

  // Collapsible sections state
  isCreateQuestionExpanded = false;
  isQuestionsListExpanded = false;
  isCreateLanguageExpanded = false;
  isLanguagesListExpanded = false;
  isImportExportExpanded = false;

  // Filters
  filters: any = {};
  languages: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadStatistics();
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.adminService.getLanguages().subscribe({
      next: (langs) => this.languages = langs,
      error: (err) => console.error('Failed to load languages', err)
    });
  }

  loadStatistics(): void {
    this.adminService.getDashboardStatistics().subscribe({
      next: (stats) => {
        this.totalQuestionsCount = stats.totalQuestions;
        this.totalUsersCount = stats.totalUsers;
        this.sessionsThisWeekCount = stats.sessionsThisWeek;
      },
      error: (err) => console.error('Failed to load statistics', err)
    });
  }

  loadQuestions(): void {
    this.adminService.getQuestions(this.currentPage, this.pageSize, this.filters).subscribe({
      next: (res) => {
        this.questions = res.items;
        this.totalItems = res.totalItems; // Ensure this matches DTO property name
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (err) => console.error('Failed to load questions', err)
    });
  }

  onFilterChange(filters: any) {
    this.filters = filters;
    this.currentPage = 1;
    this.loadQuestions();
  }

  clearFilters() {
    this.filters = {};
    // You might need to reset the child component's filter state too, 
    // but for now let's just reload. 
    // To properly reset child inputs, we'd need a ViewChild or a shared service/state.
    // Or we can just reload and let the user manually clear inputs if they want, 
    // but the button should clear them.
    // Actually, since filters are bound in AdminListComponent, clearing them here won't clear the inputs there
    // unless we pass filters back down or use a ViewChild.
    // For simplicity, I'll reload. Ideally, we should reset the inputs.
    window.location.reload(); // Quick fix for clearing state, or implement proper state reset
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuestions();
  }

  onQuestionUpdated(updated: Question) {
    this.adminService.updateQuestion(updated.id, updated).subscribe({
      next: () => {
        this.loadQuestions(); // lista újratöltése
      },
      error: err => {
        console.error('Update failed', err);
      }
    });
  }
  onQuestionDelete(id: string) {
    this.adminService.deleteQuestion(id).subscribe({
      next: () => {
        this.loadQuestions(); // törlés után újratöltöd
      },
      error: err => {
        console.error('Delete failed', err);
      }
    });
  }
  onQuestionCreated(created: Question) {
    this.adminService.createQuestion(created).subscribe({
      next: () => {
        this.loadQuestions(); // létrehozás után is frissítesz
      },
      error: err => {
        console.error('Create failed', err);
      }
    });
  }


}
