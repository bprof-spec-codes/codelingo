import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-import-export',
  standalone: false,
  templateUrl: './admin-import-export.component.html',
  styleUrl: './admin-import-export.component.scss'
})
export class AdminImportExportComponent {
  // Import állapot
  selectedImportFile: File | null = null;
  isImporting = false;
  importError: string | null = null;

  // Export állapot
  exportFormat: 'csv' | 'json' | 'aiken' = 'json';
  isExporting = false;
  exportError: string | null = null;

  constructor(private service: AdminService) {}

  // Fájl kiválasztása importhoz
  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImportFile = input.files[0];
      this.importError = null;
    } else {
      this.selectedImportFile = null;
    }
  }

  // Import indítása (szinkron, default paraméterekkel)
  onImport(): void {
    if (!this.selectedImportFile) {
      this.importError = 'Please select a file.';
      return;
    }

    this.isImporting = true;
    this.importError = null;

    this.service
      .importQuestions(this.selectedImportFile)
      .subscribe({
        next: () => {
          this.isImporting = false;
        },
        error: (err: any) => {
          this.isImporting = false;
          this.importError = err?.error?.error || 'Import failed.';
        }
      });
  }

  // Export indítása (választható formátummal)
  onExport(): void {
    this.isExporting = true;
    this.exportError = null;

    this.service
      .exportQuestions({ format: this.exportFormat })
      .subscribe({
        next: (blob: Blob) => {
          this.isExporting = false;

          const extension =
            this.exportFormat === 'csv'
              ? 'csv'
              : this.exportFormat === 'aiken'
              ? 'aiken'
              : 'json';

          const filename = `questions-export.${extension}`;
          this.downloadBlob(blob, filename);
        },
        error: (err: any) => {
          this.isExporting = false;
          this.exportError = err?.error?.error || 'Export failed.';
        }
      });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
