import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question, MultipleChoiceQuestion, CodeCompletionQuestion, QuestionType } from '../../models/question';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-admin-edit',
  standalone: false,
  templateUrl: './admin-edit.component.html',
  styleUrl: './admin-edit.component.scss'
})
export class AdminEditComponent implements OnInit {
  @Input() question?: Question; // meglévő kérdés, vagy undefined = create
  @Output() save = new EventEmitter<Question>(); // értesítés a szülőnek
  @Output() cancel = new EventEmitter<void>();
  QuestionType = QuestionType;
  questionForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    if (this.question) {
      this.patchForm(this.question);
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  initForm() {
    this.questionForm = this.fb.group({
      type: [QuestionType.MultipleChoice, Validators.required],
      language: ['', Validators.required],
      difficulty: ['medium', Validators.required],
      title: ['', Validators.required],
      questionText: ['', Validators.required],
      explanation: [''],
      tags: [''],
      metadata: [''],
      isActive: [true],
      // MultipleChoice mezők
      options: this.fb.array([]),
      correctAnswerIds: this.fb.array([]),
      allowMultipleSelection: [false],
      shuffleOptions: [false],
      // CodeCompletion mezők
      starterCode: [''],
      correctAnswer: [''],
      hints: this.fb.array([]),
      constraints: this.fb.array([])
    });
  }

  patchForm(q: Question) {
    this.questionForm.patchValue(q);

    if (q.type === QuestionType.MultipleChoice) {
      const mc = q as MultipleChoiceQuestion;
      this.setFormArray('options', mc.options);
      this.setFormArray('correctAnswerIds', mc.correctAnswerIds);
    } else if (q.type === QuestionType.CodeCompletion) {
      const cc = q as CodeCompletionQuestion;
      this.setFormArray('hints', cc.hints);
      this.setFormArray('constraints', cc.constraints);
    }
  }

  get options() { return this.questionForm.get('options') as FormArray; }
  get correctAnswerIds() { return this.questionForm.get('correctAnswerIds') as FormArray; }
  get hints() { return this.questionForm.get('hints') as FormArray; }
  get constraints() { return this.questionForm.get('constraints') as FormArray; }

  setFormArray(name: string, values: string[]) {
    const arr = this.questionForm.get(name) as FormArray;
    arr.clear();
    values.forEach(v => arr.push(this.fb.control(v)));
  }

  addOption() { this.options.push(this.fb.control('')); }
  removeOption(i: number) { this.options.removeAt(i); }
  addCorrectAnswer() { this.correctAnswerIds.push(this.fb.control('')); }
  removeCorrectAnswer(i: number) { this.correctAnswerIds.removeAt(i); }
  addHint() { this.hints.push(this.fb.control('')); }
  removeHint(i: number) { this.hints.removeAt(i); }
  addConstraint() { this.constraints.push(this.fb.control('')); }
  removeConstraint(i: number) { this.constraints.removeAt(i); }

  saveQuestion() {
    const q: Question = {
    ...this.question,             // ha edit, belemászik az eredeti (id, createdAt, stb.)
    ...this.questionForm.value,   // felülírja a form értékekkel
      createdAt: this.question?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: this.question?.createdBy || 'admin'
    };
    this.save.emit(q); // szülő értesítése
  }
}