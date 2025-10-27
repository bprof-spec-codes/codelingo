import { Component, Input, Output, OutputEmitterRef } from '@angular/core';

//Difficulty level option interface
export interface DifficultyLevel {
  value: string;
  label: string;
  description: string;
  multiplier: number;
}



@Component({
  selector: 'app-difficulty-selector',
  standalone: false,
  templateUrl: './difficulty-selector.component.html',
  styleUrl: './difficulty-selector.component.scss'
})
export class DifficultySelectorComponent {
  @Input() selectedDifficulty: string = '';

  @Output() difficultyChange = new OutputEmitterRef<string>();


  difficultyLevels: DifficultyLevel[] = [
    { value: 'easy',
      label: 'Easy',
      description: 'Perfect for beginners. Basic concepts and syntax.',
      multiplier: 1
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Intermediate challenges. Common patterns and algorithms.',
      multiplier: 1.5
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Advanced problems. Complex logic and optimization.',
      multiplier: 2
    }
  ];


}
