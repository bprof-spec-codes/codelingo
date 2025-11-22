import { Injectable } from '@angular/core';
import { MultipleChoiceQuestion } from '../models/multiple-choice-question';
import { SessionConfig } from '../models/session-config';

@Injectable({ providedIn: 'root' })
export class QuestionSessionService {
  private config: SessionConfig | null = null;
  private questions: MultipleChoiceQuestion[] = [];

  setConfig(config: SessionConfig) {
    this.config = config;
  }

  getConfig(): SessionConfig | null {
    return this.config;
  }

  /** Create mock session (later replace with API call) */
  createMockSession(config: SessionConfig) {
    this.config = config;

    this.questions = this.generateMockQuestions(config);
  }

  /** Return questions to QuestionContainer */
  getQuestions(): MultipleChoiceQuestion[] {
    return this.questions;
  }

  /** Generate mock questions based on config */
  private generateMockQuestions(
    config: SessionConfig
  ): MultipleChoiceQuestion[] {
    // -------------------------------
    // 1. MASTER QUESTION BANK
    // -------------------------------
    const questionBank: MultipleChoiceQuestion[] = [
      // ---------------------------
      // JAVASCRIPT QUESTIONS
      // ---------------------------
      {
        id: 'js-001',
        type: 'MC',
        language: 'javascript',
        difficulty: 'easy',
        title: 'Array Methods',
        questionText: 'Which method adds an element to the end of an array?',
        explanation: 'push() adds items to the end of an array.',
        tags: ['array'],
        options: [
          { id: 'opt-1', text: 'push()', order: 1 },
          { id: 'opt-2', text: 'append()', order: 2 },
          { id: 'opt-3', text: 'add()', order: 3 },
        ],
        correctAnswerIds: ['opt-1'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 20,
          pointValue: 5,
          usageCount: 120,
          averageCorrectRate: 0.86,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },
      {
        id: 'js-002',
        type: 'MC',
        language: 'javascript',
        difficulty: 'medium',
        title: '=== Operator',
        questionText: 'What does the === operator compare?',
        explanation: '=== compares both value and type.',
        tags: ['operators'],
        options: [
          { id: 'opt-1', text: 'Only value', order: 1 },
          { id: 'opt-2', text: 'Only type', order: 2 },
          { id: 'opt-3', text: 'Value and type', order: 3 },
        ],
        correctAnswerIds: ['opt-3'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 25,
          pointValue: 10,
          usageCount: 110,
          averageCorrectRate: 0.72,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },
      {
        id: 'js-003',
        type: 'MC',
        language: 'javascript',
        difficulty: 'medium',
        title: 'Async/Await',
        questionText:
          'Which keyword pauses execution inside an async function?',
        explanation: 'The await keyword pauses until a promise resolves.',
        tags: ['async'],
        options: [
          { id: 'opt-1', text: 'pause', order: 1 },
          { id: 'opt-2', text: 'await', order: 2 },
          { id: 'opt-3', text: 'yield', order: 3 },
        ],
        correctAnswerIds: ['opt-2'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 30,
          pointValue: 10,
          usageCount: 95,
          averageCorrectRate: 0.69,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },

      // ---------------------------
      // C# QUESTIONS
      // ---------------------------
      {
        id: 'cs-001',
        type: 'MC',
        language: 'csharp',
        difficulty: 'easy',
        title: 'String Uppercase',
        questionText: 'Which method converts a string to uppercase in C#?',
        explanation: 'ToUpper() returns an uppercase version of the string.',
        tags: ['string'],
        options: [
          { id: 'opt-1', text: 'ToUpper()', order: 1 },
          { id: 'opt-2', text: 'Upper()', order: 2 },
          { id: 'opt-3', text: 'toUpperCase()', order: 3 },
        ],
        correctAnswerIds: ['opt-1'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 20,
          pointValue: 5,
          usageCount: 150,
          averageCorrectRate: 0.81,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },
      {
        id: 'cs-002',
        type: 'MC',
        language: 'csharp',
        difficulty: 'medium',
        title: 'LINQ Filter',
        questionText: 'Which LINQ method filters items based on a condition?',
        explanation: 'Where() filters items matching a predicate.',
        tags: ['linq'],
        options: [
          { id: 'opt-1', text: 'Select()', order: 1 },
          { id: 'opt-2', text: 'Where()', order: 2 },
          { id: 'opt-3', text: 'Filter()', order: 3 },
        ],
        correctAnswerIds: ['opt-2'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 30,
          pointValue: 10,
          usageCount: 130,
          averageCorrectRate: 0.77,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },
      {
        id: 'cs-003',
        type: 'MC',
        language: 'csharp',
        difficulty: 'medium',
        title: 'OOP Polymorphism',
        questionText:
          'Which OOP principle lets a subclass override a base method?',
        explanation: 'Polymorphism supports method overriding.',
        tags: ['oop'],
        options: [
          { id: 'opt-1', text: 'Encapsulation', order: 1 },
          { id: 'opt-2', text: 'Abstraction', order: 2 },
          { id: 'opt-3', text: 'Polymorphism', order: 3 },
        ],
        correctAnswerIds: ['opt-3'],
        allowMultipleSelection: false,
        shuffleOptions: false,
        metadata: {
          version: 1,
          estimatedTimeSeconds: 30,
          pointValue: 15,
          usageCount: 115,
          averageCorrectRate: 0.74,
        },
        createdAt: '',
        updatedAt: '',
        createdBy: 'system',
        isActive: true,
      },
    ];

    const langKey =
      languageMap[config.language] || config.language.toLowerCase();
    const diffKey = config.difficulty.toLowerCase().trim();

    const filtered = questionBank.filter(
      (q) =>
        q.language.toLowerCase() === langKey &&
        q.difficulty.toLowerCase() === diffKey
    );

    return filtered.slice(0, config.questionCount);
  }
}

const languageMap: Record<string, string> = {
  JavaScript: 'javascript',
  Python: 'python',
  Java: 'java',
  'C#': 'csharp',
  TypeScript: 'typescript',
};
