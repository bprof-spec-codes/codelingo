import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SessionConfig } from '../models/session-config';
import {
  StartSessionRequestDto,
  StartSessionResponseDto,
  NextQuestionResponseDto,
  SubmitAnswerResponseDto,
  CloseSessionResponseDto,
} from '../dtos/session-dtos';

@Injectable({ providedIn: 'root' })
export class QuestionSessionService {
  private baseUrl = `${environment.apiUrl}/session`;
  private config: SessionConfig | null = null;

  constructor(private http: HttpClient) { }

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
      language: config.language,
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

  closeSession(sessionId: string, forceClose: boolean): Observable<CloseSessionResponseDto> {
    const request = { forceClose };
    return this.http.post<CloseSessionResponseDto>(`${this.baseUrl}/${sessionId}/close`, request);
  }
}
