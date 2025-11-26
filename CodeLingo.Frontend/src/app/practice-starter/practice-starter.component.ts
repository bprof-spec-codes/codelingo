import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionConfig } from '../models/session-config';
import { ComponentState } from '../models/component-state';
import { QuestionSessionService } from '../services/question-session.service';

@Component({
  selector: 'app-practice-starter',
  standalone: false,
  templateUrl: './practice-starter.component.html',
  styleUrl: './practice-starter.component.scss',
})
export class PracticeStarterComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: QuestionSessionService
  ) { }

  availableLanguages: string[] = [
    'JavaScript',
    'Python',
    'Java',
    'C#',
    'TypeScript',
  ];

  config: SessionConfig = {
    language: '',
    difficulty: '',
    questionCount: 10,
  };

  //component state
  state: ComponentState = {
    isLoading: false,
    error: null,
  };

  ngOnInit(): void {
    // initialization logic if needed later
  }

  // called when user selects a language
  onLangugaeChange(language: string) {
    this.config.language = language;
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
      this.state.isLoading || !this.config.language || !this.config.difficulty
    );
  }
}
