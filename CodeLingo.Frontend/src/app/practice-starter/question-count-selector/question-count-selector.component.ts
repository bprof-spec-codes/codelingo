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

  // preset question counts for quick selection
  presetCounts: number[] = [5, 10, 20, 30];

  // min and max allowed question counts
  minCount: number = 5;
  maxCount: number = 50;

  //custom count
  customCount: number | null = null;
  isCustom: boolean = false;

  onPresetSelect(count: number): void {
    this.selectedCount = count;
    this.isCustom = false;
    this.customCount = null;
    this.countChange.emit(count);
  }

  onCustomInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // limit to 2 digits
    if (input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }

    const value = parseInt(input.value, 10);

    if (value > 50) {
      input.value = input.value.slice(0, 1);
    }


    // validate the input
    if (!isNaN(value) && value >= this.minCount && value <= this.maxCount) {
      this.customCount = value;
      this.selectedCount = value;
      this.isCustom = true;
      this.countChange.emit(value);
    }
  }


  isPresetSelected(count: number): boolean {
    return !this.isCustom && this.selectedCount === count;
  }
}
