export interface QuestionMetadata {
    version: number;
    estimatedTimeSeconds: number;
    pointValue: number;
    usageCount: number;
    averageCorrectRate: number;
    lastUsedAt?: Date;
}
