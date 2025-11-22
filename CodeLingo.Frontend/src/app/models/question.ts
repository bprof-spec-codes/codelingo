export enum QuestionType {
  MultipleChoice = 'MultipleChoice',
  CodeCompletion = 'CodeCompletion'
}

export interface QuestionMetadata {
  category?: string;
  topic?: string;
  source?: string;
}

export interface BaseQuestion {
  type: QuestionType;
  language: string;
  difficulty: string;
  title: string;
  questionText: string;

  explanation?: string;
  tags?: string[];                
  metadata?: QuestionMetadata;   

  // Backend által adott mezők
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  isActive?: boolean;
}

/* ---- Multiple choice ---- */

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MultipleChoice;

  options: MultipleChoiceOption[];

  allowMultipleSelection: boolean;
  shuffleOptions: boolean;
}

/* ---- Code completion ---- */

export interface CodeCompletionQuestion extends BaseQuestion {
  type: QuestionType.CodeCompletion;

  starterCode: string;
  correctAnswer: string;
  hints: string[];
  constraints: string[];
}

/* Összefoglaló*/
export type Question = MultipleChoiceQuestion | CodeCompletionQuestion;