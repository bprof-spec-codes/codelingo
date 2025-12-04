import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: false,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {

  // list of available programming languages
  @Input() languages: Language[] = [];

  // currently selected language names (array)
  @Input() selectedLanguages: string[] = [];

  // event emitted when the selected languages change
  @Output() languagesChange = new EventEmitter<string[]>();

  // Toggle language selection
  toggleLanguage(languageName: string): void {
    const index = this.selectedLanguages.indexOf(languageName);
    if (index > -1) {
      // Remove language if already selected
      this.selectedLanguages = this.selectedLanguages.filter(l => l !== languageName);
    } else {
      // Add language if not selected
      this.selectedLanguages = [...this.selectedLanguages, languageName];
    }
    this.languagesChange.emit(this.selectedLanguages);
  }

  // Check if a language is selected
  isSelected(languageName: string): boolean {
    return this.selectedLanguages.includes(languageName);
  }

  // Remove a selected language (for badges)
  removeLanguage(languageName: string): void {
    this.selectedLanguages = this.selectedLanguages.filter(l => l !== languageName);
    this.languagesChange.emit(this.selectedLanguages);
  }

}
