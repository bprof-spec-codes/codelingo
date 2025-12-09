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
            this.config = await lastValueFrom(this.http.get<AppConfig>('assets/config.json'));
        } catch (error) {
            console.error('Could not load configuration', error);
            // Fallback for development if config.json fails/missing? 
            // Or explicitly throw to stop app startup?
            // For now, let's allow fallback or empty to avoid complete crash if not critical
            console.warn('Using default empty configuration');
            this.config = { apiUrl: '' };
        }
    }

    get apiUrl(): string {
        return this.config?.apiUrl || '';
    }
}
