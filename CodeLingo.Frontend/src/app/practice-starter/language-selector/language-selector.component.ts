import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  standalone: false,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {

  // list of available programming languages
  @Input() languages: string[] = [];

  // currently selected language
  @Input() selectedLanguage: string = '';

  // event emitted when the selected language changes
  @Output() languageChange = new EventEmitter<string>();

}
