import { AnswerOption } from "./answer-option";
import { BaseQuestion, QuestionType } from "./base-question";

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: QuestionType.MULTIPLE_CHOICE | 'MultipleChoice';
    options: AnswerOption[];
    correctAnswerIds: string[];
    allowMultipleSelection: boolean;
    shuffleOptions: boolean;
}
