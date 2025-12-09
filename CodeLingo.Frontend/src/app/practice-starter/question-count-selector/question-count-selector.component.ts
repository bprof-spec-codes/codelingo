import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-count-selector',
  standalone: false,
  templateUrl: './question-count-selector.component.html',
  styleUrl: './question-count-selector.component.scss'
})
export class QuestionCountSelectorComponent {

  // Currently selected question count
  @Input() selectedCount: number = 10;

  // Event emitted when user selects or inputs a count
  @Output() countChange = new EventEmitter<number>();
  
  // Event emitted when validation state changes
  @Output() validChange = new EventEmitter<boolean>();

  // preset question counts for quick selection
  presetCounts: number[] = [5, 10, 20, 30];

  // min and max allowed question counts
  minCount: number = 5;
  maxCount: number = 50;

  //custom count
  customCount: number | null = null;
  isCustom: boolean = false;
  
  // validation state
  isValid: boolean = true;
  errorMessage: string = '';

  onPresetSelect(count: number): void {
    this.selectedCount = count;
    this.isCustom = false;
    this.customCount = null;
    this.isValid = true;
    this.errorMessage = '';
    this.countChange.emit(count);
    this.validChange.emit(true);
  }

  onCustomInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.trim();

    // if empty, reset to invalid state
    if (rawValue === '') {
      this.customCount = null;
      this.isCustom = false;
      this.isValid = false;
      this.errorMessage = 'Please enter a number';
      this.validChange.emit(false);
      return;
    }

    const value = parseInt(rawValue, 10);

    // check if it's a valid number
    if (isNaN(value)) {
      this.isValid = false;
      this.errorMessage = 'Please enter a valid number';
      this.validChange.emit(false);
      return;
    }

    // validate the range
    if (value < this.minCount || value > this.maxCount) {
      this.customCount = value;
      this.selectedCount = value;
      this.isCustom = true;
      this.isValid = false;
      this.errorMessage = `Number must be between ${this.minCount} and ${this.maxCount}`;
      this.validChange.emit(false);
    } else {
      this.customCount = value;
      this.selectedCount = value;
      this.isCustom = true;
      this.isValid = true;
      this.errorMessage = '';
      this.countChange.emit(value);
      this.validChange.emit(true);
    }
  }


  isPresetSelected(count: number): boolean {
    return !this.isCustom && this.selectedCount === count;
  }
}
