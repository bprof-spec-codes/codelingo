import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultipleChoiceQuestion } from '../models/multiple-choice-question';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question/multiple-choice-question.component';
import { CodeCompletionQuestion } from '../models/code-completion-question';
import { CodeCompletionQuestionComponent } from './code-completion-question/code-completion-question.component';
import { QuestionSessionService } from '../services/question-session.service';
import { SessionConfig } from '../models/session-config';

@Component({
  selector: 'app-question-container',
  standalone: false,
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.scss'],
})
export class QuestionContainerComponent implements OnInit {
  @ViewChild('multipleChoiceComponent')
  multipleChoiceComponent!: MultipleChoiceQuestionComponent;

  @ViewChild('codeCompletionComponent')
  codeCompletionComponent!: CodeCompletionQuestionComponent;

  sessionId: string | null = null;
  loadingQuestion = false; // for fetching next question
  submittingAnswer = false; // for simulating POST /answer

  questionType: string | null = null;
  questionData!: MultipleChoiceQuestion | CodeCompletionQuestion;
  questionSubmitted: boolean = false;

  currentIndex = 0;
  totalQuestions = 0;
  feedback: string | null = null;
  isCorrect: boolean | null = null;
  isCompleted = false;

  constructor(
    private sessionService: QuestionSessionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sessionId = this.route.snapshot.paramMap.get('id');
    if (!this.sessionId) {
      this.router.navigate(['/practice/start']);
      return;
    }
    this.loadNextQuestion();
  }

  // Load next question
  loadNextQuestion() {
    if (!this.sessionId) return;

    this.loadingQuestion = true;
    this.feedback = null;
    this.isCorrect = null;
    this.questionSubmitted = false;

    this.sessionService.getNextQuestion(this.sessionId).subscribe({
      next: (response) => {
        this.loadingQuestion = false;
        if (response.isCompleted) {
          this.isCompleted = true;
          return;
        }

        this.currentIndex = response.currentIndex;
        this.totalQuestions = response.totalQuestions;

        // Map backend question data to frontend model if necessary
        // Assuming response.questionData matches MultipleChoiceQuestion structure for now
        this.questionData = response.questionData;
        this.questionType = response.questionType;

        // Reset selection in child component
        setTimeout(() => {
          this.multipleChoiceComponent?.resetSelection();
        });
      },
      error: (err) => {
        this.loadingQuestion = false;
        console.error('Error loading next question:', err);
        // Handle error (e.g., show error message or navigate back)
      }
    });
  }

  // Handle MC answer
  onAnswer(selectedOptionIds: string[]) {
    if (!this.sessionId) return;

    this.submittingAnswer = true;
    this.feedback = null;
    this.isCorrect = null;

    const payload = {
      questionType: this.questionType,
      questionId: this.questionData.id,
      answerIds: selectedOptionIds
    };

    this.sessionService.submitAnswer(this.sessionId, payload).subscribe({
      next: (response) => {
        this.submittingAnswer = false;
        this.questionSubmitted = true;
        this.isCorrect = response.isCorrect;
        this.feedback = response.feedback;

        // Automatically load next question after 2s
        setTimeout(() => this.loadNextQuestion(), 2000);
      },
      error: (err) => {
        this.submittingAnswer = false;
        console.error('Error submitting answer:', err);
        this.feedback = 'Error submitting answer. Please try again.';
      }
    });
  }

  // Handle Code answer
  onCodeAnswer(code: string) {
    if (!this.sessionId) return;

    this.submittingAnswer = true;
    this.feedback = null;
    this.isCorrect = null;

    const payload = {
      questionType: this.questionType,
      questionId: this.questionData.id,
      code: code
    };

    this.sessionService.submitAnswer(this.sessionId, payload).subscribe({
      next: (response) => {
        this.submittingAnswer = false;
        this.questionSubmitted = true;
        this.isCorrect = response.isCorrect;
        this.feedback = response.feedback;

        // Automatically load next question after 2s
        setTimeout(() => this.loadNextQuestion(), 2000);
      },
      error: (err) => {
        this.submittingAnswer = false;
        console.error('Error submitting answer:', err);
        this.feedback = 'Error submitting answer. Please try again.';
      }
    });
  }
}
