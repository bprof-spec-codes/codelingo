import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

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
  private get baseUrl() { return `${this.configService.apiUrl}/questions`; }

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getDemo() {
    return this.http.get<QuestionDto>(`${this.baseUrl}/demo`);
  }
}