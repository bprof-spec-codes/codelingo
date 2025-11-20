import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mc-question-editor',
  standalone: false,
  templateUrl: './mc-question-editor.component.html',
  styleUrl: './mc-question-editor.component.scss'
})
export class McQuestionEditorComponent implements OnInit {

  @Input() existingQuestion?: MultipleChoiceQuestion;
  @Input() languages: string[] = [];
  @Input() difficulties: string[] = [];

  @Output() questionSubmitted = new EventEmitter<MultipleChoiceQuestion>();
  @Output() cancelled = new EventEmitter<void>();

  questionForm!: FormGroup;
  questionId: string = '';
  version: number = 1;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      language: ['', Validators.required],
      difficulty: ['', Validators.required],
      questionText: ['', Validators.required],
      explanation: ['', Validators.required],
      tagsInput: [''],
      estimatedTimeSeconds: [30, [Validators.required, Validators.min(5), Validators.max(600)]],
      allowMultipleSelection: [false],
      shuffleOptions: [true],
      isActive: [true],
      options: this.fb.array([], Validators.minLength(2))
    });
  }

}
