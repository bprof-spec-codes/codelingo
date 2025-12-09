import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-avatar-upload',
    templateUrl: './avatar-upload.component.html',
    styleUrls: ['./avatar-upload.component.scss'],
    standalone: false
})
export class AvatarUploadComponent {
    @Input() currentUrl: string | null = null;
    @Output() urlChange = new EventEmitter<string>();

    onUrlChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.urlChange.emit(input.value);
    }

    onImageError(event: Event): void {
        // Clear the URL to show the default icon instead
        this.currentUrl = null;
        this.urlChange.emit('');
    }
}
