import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Question,
  MultipleChoiceQuestion,
  CodeCompletionQuestion,
  QuestionType,
  MultipleChoiceOption
} from '../../models/question';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

      // UI: egyszerű string, backend: string[]
      tags: [''],

      // UI: string (pl. JSON), backend: QuestionMetadata objektum
      metadata: this.fb.group({
        category: [''],
        topic: [''],
        source: ['']
      }),

      isActive: [true],

      // MultipleChoice mezők (UI: stringek, backend: MultipleChoiceOption[])
      options: this.fb.array([]),
      correctAnswerIds: this.fb.array([]),
      shuffleOptions: [false],

      // CodeCompletion mezők
      starterCode: [''],
      correctAnswer: [''],
      hints: this.fb.array([]),
      constraints: this.fb.array([])
    });
  }

  patchForm(q: Question): void {
    // alapmezők
    this.questionForm.patchValue({
      type: q.type,
      language: q.language,
      difficulty: q.difficulty,
      title: q.title,
      questionText: q.questionText,
      explanation: q.explanation ?? null,
      tags: q.tags?.join(', ') ?? '',
      metadata: {
        category: q.metadata?.category ?? '',
        topic: q.metadata?.topic ?? '',
        source: q.metadata?.source ?? ''
      }
    });

    const optionsFa = this.questionForm.get('options') as FormArray;
    const correctFa = this.questionForm.get('correctAnswerIds') as FormArray;
    const hintsFa = this.questionForm.get('hints') as FormArray;
    const constraintsFa = this.questionForm.get('constraints') as FormArray;

    optionsFa.clear();
    correctFa.clear();
    hintsFa.clear();
    constraintsFa.clear();

    if (q.type === QuestionType.MultipleChoice) {
      const mc = q as MultipleChoiceQuestion;

      this.questionForm.patchValue({
        shuffleOptions: mc.shuffleOptions
      });

      // options: MultipleChoiceOption[] → form: string[]
      mc.options.forEach(opt => {
        optionsFa.push(
          this.fb.group({
            text: [opt.text, Validators.required],
            isCorrect: [opt.isCorrect]
          })
        );
      });

    } else if (q.type === QuestionType.CodeCompletion) {
      const cc = q as CodeCompletionQuestion;

      this.questionForm.patchValue({
        starterCode: cc.starterCode,
        correctAnswer: cc.correctAnswer
      });

      cc.hints.forEach(h => hintsFa.push(new FormControl(h)));
      cc.constraints.forEach(c => constraintsFa.push(new FormControl(c)));
    }
  }

  // Ha máshol még használnád:
  private setFormArray(controlName: string, items: string[]) {
    const fa = this.questionForm.get(controlName) as FormArray;
    fa.clear();
    items.forEach(i => fa.push(new FormControl(i)));
  }

  private createOptionGroup(opt?: MultipleChoiceOption): FormGroup {
    return this.fb.group({
      text: [opt?.text ?? '', Validators.required],
      isCorrect: [opt?.isCorrect ?? false]
    });
  }

  get options() { return this.questionForm.get('options') as FormArray; }
  get correctAnswerIds() { return this.questionForm.get('correctAnswerIds') as FormArray; }
  get hints() { return this.questionForm.get('hints') as FormArray; }
  get constraints() { return this.questionForm.get('constraints') as FormArray; }

  addOption() {
    this.options.push(
      this.fb.group({
        text: ['', Validators.required],
        isCorrect: [false]
      })
    );
  }
  removeOption(i: number) { this.options.removeAt(i); }
  addCorrectAnswer() { this.correctAnswerIds.push(this.fb.control('')); }
  removeCorrectAnswer(i: number) { this.correctAnswerIds.removeAt(i); }
  addHint() { this.hints.push(this.fb.control('')); }
  removeHint(i: number) { this.hints.removeAt(i); }
  addConstraint() { this.constraints.push(this.fb.control('')); }
  removeConstraint(i: number) { this.constraints.removeAt(i); }

  saveQuestion() {
    const raw = this.questionForm.value;

    // tags: string → string[]
    const tags =
      typeof raw.tags === 'string' && raw.tags.trim().length > 0
        ? raw.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
        : undefined;

    // metadata: string (JSON) → objektum
    const metaGroup = raw.metadata;
    const hasMetadata = metaGroup && (metaGroup.category || metaGroup.topic || metaGroup.source);

    const metadata = hasMetadata
      ? {
        category: metaGroup.category || undefined,
        topic: metaGroup.topic || undefined,
        source: metaGroup.source || undefined
      }
      : undefined;

    let q: Question;

    if (raw.type === QuestionType.MultipleChoice) {
      const optionTexts: string[] = raw.options || [];
      const correctAnswers: string[] = raw.correctAnswerIds || [];
      const optionGroups = (raw.options || []) as { text: string; isCorrect: boolean }[];
      const options: MultipleChoiceOption[] = optionGroups.map(o => ({
        text: o.text,
        isCorrect: !!o.isCorrect
      }));

      q = {
        ...(this.question ?? {}),
        type: QuestionType.MultipleChoice,
        language: raw.language,
        difficulty: raw.difficulty,
        title: raw.title,
        questionText: raw.questionText,
        explanation: raw.explanation || undefined,
        tags,
        metadata,
        isActive: raw.isActive,

        options,
        shuffleOptions: raw.shuffleOptions,

        createdAt: this.question?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: this.question?.createdBy || 'admin'
      } as MultipleChoiceQuestion;
    } else {
      q = {
        ...(this.question ?? {}),
        type: QuestionType.CodeCompletion,
        language: raw.language,
        difficulty: raw.difficulty,
        title: raw.title,
        questionText: raw.questionText,
        explanation: raw.explanation || undefined,
        tags,
        metadata,
        isActive: raw.isActive,

        starterCode: raw.starterCode,
        correctAnswer: raw.correctAnswer,
        hints: raw.hints || [],
        constraints: raw.constraints || [],

        createdAt: this.question?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: this.question?.createdBy || 'admin'
      } as CodeCompletionQuestion;
    }

    console.log(q);
    this.save.emit(q); // szülő értesítése
  }
}