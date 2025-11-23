import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ProfileUpdateRequest } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.apiUrl}/users/me`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<User> {
        return this.http.get<User>(this.apiUrl);
    }

    updateProfile(profile: ProfileUpdateRequest): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(this.apiUrl, profile);
    }
}
