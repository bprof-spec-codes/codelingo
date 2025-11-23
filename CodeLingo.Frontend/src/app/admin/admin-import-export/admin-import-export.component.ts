import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-import-export',
  standalone: false,
  templateUrl: './admin-import-export.component.html',
  styleUrl: './admin-import-export.component.scss'
})
export class AdminImportExportComponent {

  selectedImportFile: File | null = null;
  importFormat: '' | 'csv' | 'aiken' = '';
  importBatchSize = 100;
  importValidateOnly = false;
  importAsync = false;
  isImporting = false;

  importReport: any | null = null; 
  importJob: any | null = null;   
  importError: string | null = null;

  exportFormat: 'csv' | 'json' | 'aiken' = 'json';
  exportLanguage = '';
  exportDifficulty = '';
  exportType = '';
  exportFromDate = '';
  exportToDate = '';
  isExporting = false;
  exportError: string | null = null;

  constructor(private service: AdminService) { }

  // IMPORT

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
    this.importJob = null;

    this.service
      .importQuestions(
        this.selectedImportFile,
        this.importFormat || undefined,
        this.importAsync,
        this.importBatchSize,
        this.importValidateOnly
      )
      .subscribe({
        next: (res: any) => {
          this.isImporting = false;

          if (res && res.jobId) {
            this.importJob = res;
          } else {
            this.importReport = res;
          }
        },
        error: (err) => {
          this.isImporting = false;
          this.importError = err?.error?.error || 'Import failed.';
        }
      });
  }

  refreshImportJobStatus(): void {
    if (!this.importJob?.jobId) {
      return;
    }

    this.service.getImportJobStatus(this.importJob.jobId).subscribe({
      next: (job: any) => {
        this.importJob = job;
      },
      error: (err) => {
        this.importError = err?.error?.error || 'Could not refresh import job status.';
      }
    });
  }
}
