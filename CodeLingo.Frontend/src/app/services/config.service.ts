import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
    apiUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: AppConfig | null = null;

    constructor(private http: HttpClient) { }

    async loadConfig(): Promise<void> {
        try {
            this.config = await lastValueFrom(this.http.get<AppConfig>('/assets/config.json'));
        } catch (error) {
            console.error('Could not load configuration', error);
            console.warn('Using built-in configuration fallback');
            const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
            this.config = {
                apiUrl: isLocalhost ? 'http://localhost:5062/api' : 'https://api.codelingo.hu/api'
            };
        }
    }

    get apiUrl(): string {
        return this.config?.apiUrl || '';
    }
}
