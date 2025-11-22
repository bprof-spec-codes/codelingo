import { TestBed } from '@angular/core/testing';
import { QuestionSessionService } from './question-session.service';
import { SessionConfig } from '../models/session-config';
import { MultipleChoiceQuestion } from '../models/multiple-choice-question';

describe('QuestionSessionService', () => {
  let service: QuestionSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionSessionService],
    });
    service = TestBed.inject(QuestionSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get config correctly', () => {
    const config: SessionConfig = {
      language: 'C#',
      difficulty: 'easy',
      questionCount: 1,
    };
    service.setConfig(config);
    expect(service.getConfig()).toEqual(config);
  });

  it('should create a mock session with filtered questions', () => {
    const config: SessionConfig = {
      language: 'C#',
      difficulty: 'easy',
      questionCount: 1,
    };
    service.createMockSession(config);

    const questions = service.getQuestions();
    expect(questions.length).toBe(1);
    expect(questions[0].language.toLowerCase()).toBe('csharp');
    expect(questions[0].difficulty.toLowerCase()).toBe('easy');
  });

  it('should respect questionCount limit', () => {
    const config: SessionConfig = {
      language: 'javascript',
      difficulty: 'medium',
      questionCount: 2,
    };
    service.createMockSession(config);

    const questions = service.getQuestions();
    expect(questions.length).toBeLessThanOrEqual(2);
    questions.forEach((q: MultipleChoiceQuestion) => {
      expect(q.language.toLowerCase()).toBe('javascript');
      expect(q.difficulty.toLowerCase()).toBe('medium');
    });
  });

  it('should return empty array if no questions match', () => {
    const config: SessionConfig = {
      language: 'Python',
      difficulty: 'hard',
      questionCount: 5,
    };
    service.createMockSession(config);

    const questions = service.getQuestions();
    expect(questions.length).toBe(0);
  });

  it('should handle unknown language gracefully', () => {
    const config: SessionConfig = {
      language: 'UnknownLang',
      difficulty: 'easy',
      questionCount: 1,
    };
    service.createMockSession(config);

    const questions = service.getQuestions();
    expect(questions.length).toBe(0);
  });

  it('should filter correctly with languageMap (C# → csharp)', () => {
    const config: SessionConfig = {
      language: 'C#',
      difficulty: 'medium',
      questionCount: 1,
    };
    service.createMockSession(config);

    const questions = service.getQuestions();
    expect(questions.length).toBe(1);
    expect(questions[0].language).toBe('csharp');
    expect(questions[0].difficulty).toBe('medium');
  });
});
