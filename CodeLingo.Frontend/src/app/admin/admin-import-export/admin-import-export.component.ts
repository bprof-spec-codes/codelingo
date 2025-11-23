import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-import-export',
  standalone: false,
  templateUrl: './admin-import-export.component.html',
  styleUrl: './admin-import-export.component.scss'
})
export class AdminImportExportComponent {
// IMPORT
  selectedImportFile: File | null = null;
  importFormat: '' | 'csv' | 'aiken' = ''; // üres = auto detect
  importBatchSize = 100;
  importValidateOnly = false;
  isImporting = false;
  importError: string | null = null;
  importReport: any = null; // szerver válasza (200 OK)

  // EXPORT
  exportFormat: 'csv' | 'json' | 'aiken' = 'json';
  exportLanguage = '';
  exportDifficulty = '';
  exportType = '';
  exportFromDate = '';
  exportToDate = '';
  isExporting = false;
  exportError: string | null = null;

  constructor(private service: AdminService) { }

  // ===== IMPORT =====

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImportFile = input.files[0];
    } else {
      this.selectedImportFile = null;
    }
  }

  onImport(): void {
    if (!this.selectedImportFile) {
      this.importError = 'Please select a file.';
      return;
    }

    this.isImporting = true;
    this.importError = null;
    this.importReport = null;

    this.service
      .importQuestions(
        this.selectedImportFile,
        this.importFormat || undefined,
        false, // async = false, szinkron feldolgozás
        this.importBatchSize,
        this.importValidateOnly
      )
      .subscribe({
        next: (res: any) => {
          this.isImporting = false;
          this.importReport = res;
        },
        error: (err) => {
          this.isImporting = false;
          this.importError = err?.error?.error || 'Import failed.';
        }
      });
  }

  // ===== EXPORT =====

  onExport(): void {
    this.isExporting = true;
    this.exportError = null;

    this.service
      .exportQuestions({
        format: this.exportFormat,
        language: this.exportLanguage || undefined,
        difficulty: this.exportDifficulty || undefined,
        type: this.exportType || undefined,
        fromDate: this.exportFromDate || undefined,
        toDate: this.exportToDate || undefined,
        async: false // közvetlen letöltés
      })
      .subscribe({
        next: (blob: Blob) => {
          this.isExporting = false;
          const extension =
            this.exportFormat === 'csv'
              ? 'csv'
              : this.exportFormat === 'aiken'
              ? 'txt'
              : 'json';

          const filename = `questions-export.${extension}`;
          this.downloadBlob(blob, filename);
        },
        error: (err) => {
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
