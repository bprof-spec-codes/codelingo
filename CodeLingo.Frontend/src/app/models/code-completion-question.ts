import { BaseQuestion, QuestionType } from "./base-question";
import { CodeConstraints } from "./code-constraints";
import { TestCase } from "./test-case";

export interface CodeCompletionQuestion extends BaseQuestion {
    type: 'CODE';
    starterCode: string;
    solutionCode: string;
    testCases: TestCase[];
    constraints: CodeConstraints;
    hints: string[];
}
