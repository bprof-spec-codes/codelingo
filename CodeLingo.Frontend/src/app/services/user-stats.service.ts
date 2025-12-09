import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStatistics } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserStatsService {
    private apiUrl = `${environment.apiUrl}/users/me/statistics`;

    constructor(private http: HttpClient) { }

    getStatistics(): Observable<UserStatistics> {
        return this.http.get<UserStatistics>(this.apiUrl);
    }
}
