import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionConfig } from '../models/session-config';
import { ComponentState } from '../models/component-state';

@Component({
  selector: 'app-practice-starter',
  standalone: false,
  templateUrl: './practice-starter.component.html',
  styleUrl: './practice-starter.component.scss'
})
export class PracticeStarterComponent implements OnInit{

  private router: Router = inject(Router);

  availableLanguages: string[] = ['JavaScript', 'Python', 'Java', 'C#', 'TypeScript'];

  config: SessionConfig = {
      language: '',
      difficulty: '',
      questionCount: 10
  }

  //component state
  state: ComponentState = {
    isLoading: false,
    error: null
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
  async startSession(): Promise<void> {
    
    this.state.isLoading = true;
    
    this.state.error = null;


    try {
      //TODO: Call StartSession API here
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      //simulate getting a session ID from API / TODO: replace with actual API response
      const sessionId = 'dummy-session-id';

      // TODO: Navigate to practice session page with session ID
      // this.router.navigate(['/practice/session', mockSessionId]);

      // For now, just show success message
      alert(`Session configured successfully!\n\nLanguage: ${this.config.language}\nDifficulty: ${this.config.difficulty}\nQuestions: ${this.config.questionCount}`);

    } catch (error) {
      this.state.error = 'Failed to start practice session. Please try again.';
      console.error('Error starting practice session:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  get isStartButtonDisabled(): boolean {
    return this.state.isLoading || !this.config.language || !this.config.difficulty;
  }
}
