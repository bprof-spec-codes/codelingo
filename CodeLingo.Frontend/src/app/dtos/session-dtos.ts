export interface StartSessionRequestDto {
    userId: string;
    languageIds: string[];
    difficulty: string;
    requestedQuestionCount: number;
}

export interface StartSessionResponseDto {
    sessionId: string;
    totalPlannedQuestions: number;
}

export interface NextQuestionResponseDto {
    questionId: string;
    questionType: string;
    questionData: any;
    currentIndex: number;
    totalQuestions: number;
    isCompleted: boolean;
    metadata: any;
}

export interface SubmitAnswerRequestDto {
    requestId: string;
    answerPayload: any;
}

export interface SubmitAnswerResponseDto {
    isCorrect: boolean;
    feedback: string;
    score: number;
    currentIndex: number;
    totalQuestions: number;
    isCompleted: boolean;
}
