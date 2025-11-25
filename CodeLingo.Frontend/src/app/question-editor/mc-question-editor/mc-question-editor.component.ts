import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { McQuestionCreateDto } from '../../dtos/mc-question-create-dto';
import { OptionDto } from '../../dtos/option-dto';


@Component({
  selector: 'app-mc-question-editor',
  standalone: false,
  templateUrl: './mc-question-editor.component.html',
  styleUrl: './mc-question-editor.component.scss'
})
export class McQuestionEditorComponent implements OnInit {

  @Input() existingQuestion?: McQuestionCreateDto;
  @Input() languages: string[] = [];
  @Input() difficulties: string[] = [];

  @Output() questionSubmitted = new EventEmitter<McQuestionCreateDto>();
  @Output() cancelled = new EventEmitter<void>();

  questionForm!: FormGroup;

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
      explanation: [''],
      tagsInput: [''],
      category: [''],
      topic: [''],
      source: [''],
      options: this.fb.array([], Validators.minLength(2))
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOptionFormGroup(option?: any): FormGroup {
    return this.fb.group({
      text: [option?.text || '', Validators.required],
      isCorrect: [option?.isCorrect || false]
    });
  }

  // load existing question
  loadExistingQuestion(): void {
    if (!this.existingQuestion) return;

    // parse tags
    const tagsInput = Array.isArray(this.existingQuestion.tags) 
      ? this.existingQuestion.tags.join(', ') 
      : '';

    // patch form values
    this.questionForm.patchValue({
      title: this.existingQuestion.title,
      language: this.existingQuestion.language,
      difficulty: this.existingQuestion.difficulty,
      questionText: this.existingQuestion.questionText,
      explanation: this.existingQuestion.explanation || '',
      tagsInput: tagsInput,
      category: this.existingQuestion.metadata?.category || '',
      topic: this.existingQuestion.metadata?.topic || '',
      source: this.existingQuestion.metadata?.source || ''
    });

    // load options
    if (this.existingQuestion.options && Array.isArray(this.existingQuestion.options)) {
      this.existingQuestion.options.forEach((option: any) => {
        const optionGroup = this.createOptionFormGroup(option);
        this.options.push(optionGroup);
      });
    }
  }

  // new question
  initializeNewQuestion(): void {
    this.addNewOption();
    this.addNewOption();
  }

  addNewOption(): void {
    const newOption = this.createOptionFormGroup();
    this.options.push(newOption);
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  toggleCorrectAnswer(index: number): void {
    const currentIsCorrect = this.options.at(index).get('isCorrect')?.value;
    this.options.at(index).patchValue({ isCorrect: !currentIsCorrect });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  isFormValid(): boolean {
    return this.questionForm.valid && this.hasCorrectAnswer();
  }

  hasCorrectAnswer(): boolean {
    return this.options.controls.some(control => control.get('isCorrect')?.value);
  }

  submitQuestion(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields and select at least one correct answer!');
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const tags = this.parseTags();

    const options: OptionDto[] = formValue.options.map((opt: any) => ({
      text: opt.text,
      isCorrect: opt.isCorrect
    }));

    const question: McQuestionCreateDto = {
      type: 'MC',
      language: formValue.language,
      difficulty: formValue.difficulty,
      title: formValue.title,
      questionText: formValue.questionText,
      explanation: formValue.explanation || undefined,
      tags: tags.length > 0 ? tags : undefined,
      metadata: (formValue.category || formValue.topic || formValue.source) ? {
        category: formValue.category || undefined,
        topic: formValue.topic || undefined,
        source: formValue.source || undefined
      } : undefined,
      options: options
    };

    this.questionSubmitted.emit(question);
  }

  parseTags(): string[] {
    const tagsInput = this.questionForm.get('tagsInput')?.value || '';
    return tagsInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);
  }


}
