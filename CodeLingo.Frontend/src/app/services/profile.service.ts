import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, ProfileUpdateRequest } from '../models/user';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private get apiUrl() { return `${this.configService.apiUrl}/users/me`; }

    private profileUpdatedSubject = new Subject<void>();
    profileUpdated$ = this.profileUpdatedSubject.asObservable();

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getProfile(): Observable<User> {
        return this.http.get<User>(this.apiUrl);
    }

    updateProfile(profile: ProfileUpdateRequest): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(this.apiUrl, profile).pipe(
            tap(() => this.profileUpdatedSubject.next())
        );
    }
}
