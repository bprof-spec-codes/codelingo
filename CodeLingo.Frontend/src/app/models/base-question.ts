export enum QuestionType {
    MULTIPLE_CHOICE = 'MC',
    CODE_COMPLETION = 'CODE',
    TRUE_FALSE = 'TF',
    FILL_IN_BLANK = 'FIB',
    CODE_REVIEW = 'REVIEW'
}

export enum DifficultyLevel {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export type ProgrammingLanguage = 'csharp' | 'javascript' | 'python' | 'java' | 'cpp' | 'go';

export interface QuestionMetadata {
    version: number;
    estimatedTimeSeconds: number;
    pointValue: number;
    usageCount: number;
    averageCorrectRate: number;
    lastUsedAt?: Date;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType | string;
    language: ProgrammingLanguage | string;
    difficulty: DifficultyLevel | string;
    title: string;
    questionText: string;
    explanation: string;
    tags: string[];
    metadata: QuestionMetadata;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isActive: boolean;
}
