import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultipleChoiceQuestion } from '../../models/multiple-choice-question';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerOption } from '../../models/answer-option';

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

    if (this.existingQuestion) {
      this.loadExistingQuestion();
    } else {
      this.initializeNewQuestion();
    }
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

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOptionFormGroup(option?: AnswerOption): FormGroup {
    return this.fb.group({
      id: [option?.id || this.generateOptionId()],
      text: [option?.text || '', Validators.required],
      imageUrl: [option?.imageUrl || ''],
      order: [option?.order || 1],
      isCorrect: [false]
    });
  }

  // load existing question
  loadExistingQuestion(): void {
    if (!this.existingQuestion) return;

    this.questionId = this.existingQuestion.id;
    this.version = this.existingQuestion.metadata.version + 1;

    // parse tags
    const tagsInput = this.existingQuestion.tags.join(', ');

    // patch form values
    this.questionForm.patchValue({
      title: this.existingQuestion.title,
      language: this.existingQuestion.language,
      difficulty: this.existingQuestion.difficulty,
      questionText: this.existingQuestion.questionText,
      explanation: this.existingQuestion.explanation,
      tagsInput: tagsInput,
      estimatedTimeSeconds: this.existingQuestion.metadata.estimatedTimeSeconds,
      allowMultipleSelection: this.existingQuestion.allowMultipleSelection,
      shuffleOptions: this.existingQuestion.shuffleOptions,
      isActive: this.existingQuestion.isActive
    });

    // load options
    this.existingQuestion.options.forEach(option => {
      const optionGroup = this.createOptionFormGroup(option);
      const isCorrect = this.existingQuestion!.correctAnswerIds.includes(option.id);
      optionGroup.patchValue({ isCorrect });
      this.options.push(optionGroup);
    });
  }

  generateOptionId(): string {
    return 'opt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // new question
  initializeNewQuestion(): void {
    this.questionId = this.generateId();
    this.addNewOption();
    this.addNewOption();
  }

  generateId(): string {
    return 'mc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  addNewOption(): void {
    const newOption = this.createOptionFormGroup();
    newOption.patchValue({ order: this.options.length + 1 });
    this.options.push(newOption);
  }

}
