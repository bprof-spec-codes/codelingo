import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStatistics, UserStats } from '../models/user';
import { environment } from '../../environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserStatsService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    getStatistics(): Observable<UserStatistics> {
        return this.http.get<UserStatistics>(`${this.apiUrl}/me/statistics`);
    }

    getUserStats(): Observable<UserStats> {
        const userId = this.authService.getUserId();
        return this.http.get<UserStats>(`${this.apiUrl}/${userId}/stats`);
    }
}
