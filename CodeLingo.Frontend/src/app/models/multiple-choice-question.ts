import { AnswerOption } from "./answer-option";
import { QuestionMetadata } from "./question-metadata";

export interface MultipleChoiceQuestion {
    id: string;
    type: string;
    language: string;
    difficulty: string;
    title: string;
    questionText: string;
    explanation: string;
    tags: string[];
    options: AnswerOption[];
    correctAnswerIds: string[];
    allowMultipleSelection: boolean;
    shuffleOptions: boolean;
    metadata: QuestionMetadata;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isActive: boolean;
}
