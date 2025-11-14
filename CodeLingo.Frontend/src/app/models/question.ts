export interface Question {
  id: string;
  type: string;          
  language: string;
  difficulty: string;    
  title: string;
  questionText: string;
  explanation: string;
  tags: string;
  metadata: string;
  createdAt: Date;     
  updatedAt: Date;     
  createdBy: string;
  isActive: boolean;
}
export interface MultipleChoiceQuestion extends Question {
  options: string[];
  correctAnswerIds: string[];
  allowMultipleSelection: boolean;
  shuffleOptions: boolean;
}

export interface CodeCompletionQuestion extends Question {
  starterCode: string;
  correctAnswer: string;
  hints: string[];
  constraints: string[];
}