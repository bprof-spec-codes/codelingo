import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Question, QuestionListResponseDto } from '../models/question';
import { Language } from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  private languagesSubject = new BehaviorSubject<Language[]>([]);
  languages$ = this.languagesSubject.asObservable();

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.baseUrl}/languages`);
  }

  addLanguage(data: { name: string; version: string; shortCode: string }): Observable<Language> {
    return this.http.post<Language>(`${this.baseUrl}/languages`, data);
  }

  updateLanguage(id: number, data: { name?: string; version?: string; shortCode?: string }): Observable<Language> {
    return this.http.put<Language>(`${this.baseUrl}/languages/${id}`, data);
  }

  deleteLanguage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/languages/${id}`);
  }

  // Questions

  getQuestions(page: number = 1, pageSize: number = 20, filters?: any): Observable<QuestionListResponseDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.language) params = params.set('language', filters.language);
      if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
      if (filters.title) params = params.set('title', filters.title);
      if (filters.questionText) params = params.set('questionText', filters.questionText);
    }

    return this.http.get<QuestionListResponseDto>(`${this.baseUrl}/questions`, { params });
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/questions/${id}`);
  }

  createQuestion(data: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, data);
  }

  updateQuestion(id: string, data: Question): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/questions/${id}`, data);
  }

  deleteQuestion(id: string): Observable<void> {
    console.log(`${this.baseUrl}/questions/${id}`)
    return this.http.delete<void>(`${this.baseUrl}/questions/${id}`);
  }
  /** Import questions from CSV or Aiken file */
  importQuestions(file: File, format?: 'csv' | 'aiken', async = false, batchSize = 100, validateOnly = false): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (format) formData.append('format', format);
    formData.append('async', String(async));
    formData.append('batchSize', String(batchSize));
    formData.append('validateOnly', String(validateOnly));

    return this.http.post(`${this.baseUrl}/questions/import`, formData);
  }

  /** Export questions with optional filters and format */
  exportQuestions(params?: {
    format?: 'csv' | 'json' | 'aiken',
    language?: string,
    difficulty?: string,
    type?: string,
    fromDate?: string,
    toDate?: string,
    async?: boolean
  }): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.baseUrl}/questions/export`, { params: httpParams, responseType: 'blob' });
  }

  // Statistics
  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/statistics/dashboard`);
  }
}
