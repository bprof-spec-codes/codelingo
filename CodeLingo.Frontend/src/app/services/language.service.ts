import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface Language {
  id: number;
  name: string;
  shortCode: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private get baseUrl() { return `${this.configService.apiUrl}/admin/languages`; }

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.baseUrl);
  }
}
