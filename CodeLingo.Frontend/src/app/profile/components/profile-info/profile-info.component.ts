import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, ProfileUpdateRequest } from '../../../models/user';

@Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss'],
    standalone: false
})
export class ProfileInfoComponent implements OnChanges {
    @Input() user!: User;
    @Input() isEditing = false;
    @Input() isSaving = false;
    @Output() save = new EventEmitter<ProfileUpdateRequest>();
    @Output() cancel = new EventEmitter<void>();

    profileForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.profileForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            profilePictureUrl: ['']
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['user'] && this.user) {
            this.profileForm.patchValue({
                username: this.user.username,
                email: this.user.email,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                profilePictureUrl: this.user.profilePictureUrl
            });
        }
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            this.save.emit(this.profileForm.value);
        } else {
            this.profileForm.markAllAsTouched();
        }
    }

    onCancel(): void {
        // Reset form to original user values
        if (this.user) {
            this.profileForm.patchValue({
                username: this.user.username,
                email: this.user.email,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                profilePictureUrl: this.user.profilePictureUrl
            });
        }
        this.cancel.emit();
    }

    onAvatarChange(url: string): void {
        this.profileForm.patchValue({ profilePictureUrl: url });
        this.profileForm.markAsDirty();
    }
}
