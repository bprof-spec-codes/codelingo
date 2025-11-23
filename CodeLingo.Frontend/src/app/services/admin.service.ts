import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Question } from '../models/question';
import { Language } from '../models/language';
const MOCK_LANGUAGES: Language[] = [
  new Language('lang-1', 'TypeScript', '5.6', '2025-01-01T10:00:00Z', '2025-01-10T12:00:00Z'),
  new Language('lang-2', 'JavaScript', 'ES2023', '2025-01-05T09:30:00Z', '2025-01-15T14:20:00Z'),
  new Language('lang-3', 'C#', '12.0', '2025-02-01T08:00:00Z', '2025-02-03T16:45:00Z'),
  new Language('lang-4', 'Python', '3.13', '2025-03-10T11:15:00Z', '2025-03-20T18:30:00Z')
];
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Languages
  private languagesStore: Language[] = [...MOCK_LANGUAGES];
  private languagesSubject = new BehaviorSubject<Language[]>(this.languagesStore);
  languages$ = this.languagesSubject.asObservable();

  getLanguages(): Observable<Language[]> {
    // NEM megy ki HTTP-re, csak a subject-et adja vissza
    return this.languages$;
    //return this.http.get<Language[]>(`${this.baseUrl}/languages`);
  }

  addLanguage(data: { name: string; version: string }): Observable<Language> {
    return this.http.post<any>(`${this.baseUrl}/languages`, data);
  }

  updateLanguage(id: string, data: { name?: string; version?: string }): Observable<Language> {
    return this.http.put<Language>(`${this.baseUrl}/languages/${id}`, data);
  }

  deleteLanguage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/languages/${id}`);
  }

  // Questions

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
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

    // Expecting binary file response
    return this.http.get(`${this.baseUrl}/questions/export`, { params: httpParams, responseType: 'blob' });
  }
  getImportJobStatus(jobId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/questions/import/${jobId}/status`);
  }

  /** Export job státusz lekérdezése */
  getExportJobStatus(jobId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/questions/export/${jobId}/status`);
  }
}
