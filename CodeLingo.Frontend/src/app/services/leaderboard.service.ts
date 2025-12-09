import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { LeaderboardDto } from '../models/leaderboard';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private get apiUrl() { return `${this.configService.apiUrl}/leaderboard`; }

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getLeaderboard(page: number = 1, pageSize: number = 10, language?: string, difficulty?: string): Observable<LeaderboardDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (language) {
      params = params.set('language', language);
    }
    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }

    return this.http.get<LeaderboardDto>(this.apiUrl, { params });
  }
}