import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionConfig } from '../models/session-config';
import { ComponentState } from '../models/component-state';
import { QuestionSessionService } from '../services/question-session.service';
import { LanguageService, Language } from '../services/language.service';

@Component({
  selector: 'app-practice-starter',
  standalone: false,
  templateUrl: './practice-starter.component.html',
  styleUrl: './practice-starter.component.scss',
})
export class PracticeStarterComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: QuestionSessionService,
    private languageService: LanguageService
  ) { }

  availableLanguages: Language[] = [];

  config: SessionConfig = {
    languageIds: [],
    difficulty: '',
    questionCount: 10,
  };

  //component state
  state: ComponentState = {
    isLoading: false,
    error: null,
  };

  ngOnInit(): void {
    // Fetch available languages from backend
    this.languageService.getLanguages().subscribe({
      next: (languages) => {
        this.availableLanguages = languages;
      },
      error: (err) => {
        console.error('Error fetching languages:', err);
        this.state.error = 'Failed to load languages. Please refresh the page.';
      }
    });
  }

  // called when user selects languages (now handles array)
  onLanguagesChange(languages: string[]) {
    this.config.languageIds = languages;
  }

  // called when user selects a difficulty
  onDifficultyChange(difficulty: string): void {
    this.config.difficulty = difficulty;
  }

  // called when user selects question count
  onQuestionCountChange(count: number): void {
    this.config.questionCount = count;
  }

  // start practice session with API call
  startSession(): void {
    this.state.isLoading = true;
    this.state.error = null;

    this.sessionService.startSession(this.config).subscribe({
      next: (response) => {
        this.state.isLoading = false;
        this.router.navigate([`/session/${response.sessionId}/questions`]);
      },
      error: (err) => {
        this.state.isLoading = false;
        this.state.error = 'Failed to start practice session. Please try again.';
        console.error('Error starting practice session:', err);
      },
    });
  }

  get isStartButtonDisabled(): boolean {
    return (
      this.state.isLoading || 
      this.config.languageIds.length === 0 || 
      !this.config.difficulty
    );
  }
}
