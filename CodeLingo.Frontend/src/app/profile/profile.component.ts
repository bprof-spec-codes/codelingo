import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { User, ProfileUpdateRequest } from '../models/user';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    isLoading = false;
    isSaving = false;
    error: string | null = null;
    successMessage: string | null = null;
    isEditing = false;

    constructor(private profileService: ProfileService) { }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.isLoading = true;
        this.error = null;
        this.profileService.getProfile()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (user: User) => {
                    this.user = user;
                },
                error: (err: any) => {
                    this.error = 'Failed to load profile. Please try again.';
                    console.error('Error loading profile:', err);
                }
            });
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;
        this.successMessage = null;
        this.error = null;
    }

    onSave(updatedProfile: ProfileUpdateRequest): void {
        this.isSaving = true;
        this.error = null;
        this.successMessage = null;

        this.profileService.updateProfile(updatedProfile)
            .pipe(finalize(() => this.isSaving = false))
            .subscribe({
                next: () => {
                    this.successMessage = 'Profile updated successfully!';
                    this.isEditing = false;
                    this.loadProfile(); // Reload to get fresh data
                },
                error: (err: any) => {
                    this.error = 'Failed to update profile. Please check your inputs.';
                    console.error('Error updating profile:', err);
                }
            });
    }

    onCancel(): void {
        this.isEditing = false;
        this.error = null;
        this.successMessage = null;
    }
}
