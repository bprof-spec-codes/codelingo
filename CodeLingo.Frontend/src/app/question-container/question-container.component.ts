import { Component, OnInit, ViewChild } from '@angular/core';
import { MultipleChoiceQuestion } from '../models/multiple-choice-question';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question/multiple-choice-question.component';
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

  sessionConfig: SessionConfig | null = null;

  loadingQuestion = false; // for fetching next question
  submittingAnswer = false; // for simulating POST /answer

  questionType: string | null = null;
  questionData!: MultipleChoiceQuestion;
  questionSubmitted: boolean = false;

  questions: MultipleChoiceQuestion[] = [];
  currentIndex = 0;
  totalQuestions = 3;
  feedback: string | null = null;
  isCorrect: boolean | null = null;
  isCompleted = false;

  constructor(private sessionService: QuestionSessionService) {}

  ngOnInit() {
    const config = this.sessionService.getConfig();
    this.questions = this.sessionService.getQuestions();

    console.log(this.questions);
    
    this.totalQuestions = this.questions.length;
    this.loadNextQuestion();
  }

  // Load next question
  loadNextQuestion() {
    this.loadingQuestion = true;
    this.feedback = null;
    this.isCorrect = null;
    this.questionSubmitted = false;

    setTimeout(() => {
      this.currentIndex++;

      if (this.currentIndex > this.totalQuestions) {
        this.isCompleted = true;
        this.loadingQuestion = false;
        return;
      }

      this.questionData = this.questions[this.currentIndex - 1];
      this.multipleChoiceComponent?.resetSelection();
      this.questionType = 'multiple_choice';
      this.loadingQuestion = false;
    }, 500); // simulate API delay
  }

  // Handle MC answer
  onAnswer(selectedOptionIds: string[]) {
    this.submittingAnswer = true;
    this.feedback = null;
    this.isCorrect = null;

    setTimeout(() => {
      this.submittingAnswer = false;

      const correctIds = this.questionData.correctAnswerIds;
      const allCorrect =
        correctIds.length === selectedOptionIds.length &&
        correctIds.every((id) => selectedOptionIds.includes(id));

      this.isCorrect = allCorrect;
      this.feedback = allCorrect
        ? 'Correct!'
        : `Incorrect. The correct answer${
            correctIds.length > 1 ? 's are' : ' is'
          }: ${correctIds
            .map((id) => {
              const option = this.questionData.options.find((o) => o.id === id);
              return option?.text;
            })
            .join(', ')}`;

      this.questionSubmitted = true;

      // Automatically load next question after 2s
      setTimeout(() => this.loadNextQuestion(), 2000);
    }, 1200); // simulate network delay
  }
}
