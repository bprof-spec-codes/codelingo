import { OptionDto } from "./option-dto";
import { QuestionMetadataDto } from "./question-metadata-dto";

export interface McQuestionCreateDto {
    type: string;
    language: string;
    difficulty: string;
    title: string;
    questionText: string;
    explanation?: string;
    tags?: string[];
    metadata?: QuestionMetadataDto;
    options: OptionDto[];
}
