import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private baseUrl = `${environment.apiUrl}/languages`;

  constructor(private http: HttpClient) { }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.baseUrl);
  }
}
