import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { SessionConfig } from '../models/session-config';
import {
  StartSessionRequestDto,
  StartSessionResponseDto,
  NextQuestionResponseDto,
  SubmitAnswerResponseDto,
} from '../dtos/session-dtos';

@Injectable({ providedIn: 'root' })
export class QuestionSessionService {
  private get baseUrl() { return `${this.configService.apiUrl}/session`; }
  private config: SessionConfig | null = null;

  constructor(private http: HttpClient, private configService: ConfigService) { }

  setConfig(config: SessionConfig) {
    this.config = config;
  }

  getConfig(): SessionConfig | null {
    return this.config;
  }

  startSession(config: SessionConfig): Observable<StartSessionResponseDto> {
    this.config = config;
    const request: StartSessionRequestDto = {
      userId: 'test-user', // TODO: Get from auth service
      languageIds: config.languageIds,
      difficulty: config.difficulty,
      requestedQuestionCount: config.questionCount,
    };
    return this.http.post<StartSessionResponseDto>(`${this.baseUrl}/start`, request);
  }

  getNextQuestion(sessionId: string): Observable<NextQuestionResponseDto> {
    return this.http.get<NextQuestionResponseDto>(`${this.baseUrl}/${sessionId}/next`);
  }

  submitAnswer(sessionId: string, answerPayload: any): Observable<SubmitAnswerResponseDto> {
    return this.http.post<SubmitAnswerResponseDto>(`${this.baseUrl}/${sessionId}/answer`, answerPayload);
  }
}
