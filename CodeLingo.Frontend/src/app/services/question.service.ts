import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface QuestionDto {
  id: number;
  programmingLanguageId: number;
  programmingLanguageName: string;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  hardnessLevel: number;
  hardnessLevelText: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private baseUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getDemo() {
    return this.http.get<QuestionDto>(`${this.baseUrl}/demo`);
  }
}