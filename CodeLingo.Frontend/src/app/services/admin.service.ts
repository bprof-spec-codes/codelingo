import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Languages
  
  getLanguages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/languages`);
  }

  addLanguage(data: { name: string; version: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/languages`, data);
  }

  updateLanguage(id: string, data: { name?: string; version?: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/languages/${id}`, data);
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

  createQuestion(data: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, data);
  }

  updateQuestion(id: string, data: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/questions/${id}`, data);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/questions/${id}`);
  }
}
