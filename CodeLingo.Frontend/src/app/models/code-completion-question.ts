import { BaseQuestion, QuestionType } from "./base-question";
import { CodeConstraints } from "./code-constraints";
import { TestCase } from "./test-case";

export interface CodeCompletionQuestion extends BaseQuestion {
    type: QuestionType.CODE_COMPLETION | 'CodeCompletion';
    codeSnippet: string;
    acceptedAnswers: string[];
}
