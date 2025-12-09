import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStatistics } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class UserStatsService {
    private get apiUrl() { return `${this.configService.apiUrl}/users/me/statistics`; }

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getStatistics(): Observable<UserStatistics> {
        return this.http.get<UserStatistics>(this.apiUrl);
    }
}
