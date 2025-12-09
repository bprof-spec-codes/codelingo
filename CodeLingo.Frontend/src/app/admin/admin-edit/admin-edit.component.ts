import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Question,
  MultipleChoiceQuestion,
  CodeCompletionQuestion,
  QuestionType,
  MultipleChoiceOption
} from '../../models/question';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface CodeConstraints {
  maxLines?: number;
  maxCharacters?: number;
  forbiddenKeywords?: string[];
}

@Component({
  selector: 'app-admin-edit',
  standalone: false,
  templateUrl: './admin-edit.component.html',
  styleUrl: './admin-edit.component.scss'
})
export class AdminEditComponent implements OnInit {
  @Input() question?: Question;
  @Output() save = new EventEmitter<Question>();
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
      difficulty: ['Medium', Validators.required],
      title: ['', Validators.required],
      questionText: ['', Validators.required],
      explanation: [''],

      tags: [''],

      metadata: this.fb.group({
        category: [''],
        topic: [''],
        source: ['']
      }),

      isActive: [true],

      // Multiple choice
      options: this.fb.array([]),
      correctAnswerIds: this.fb.array([]), // Not used for MC in this form structure, but kept for compatibility if needed
      shuffleOptions: [false],

      // Code completion
      codeSnippet: [''],
      acceptedAnswers: this.fb.array([])
    });
  }

  patchForm(q: Question): void {
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
      },
      isActive: q.isActive ?? true
    });

    const optionsFa = this.options;
    const acceptedAnswersFa = this.acceptedAnswers;

    optionsFa.clear();
    acceptedAnswersFa.clear();

    if (q.type === QuestionType.MultipleChoice) {
      const mc = q as MultipleChoiceQuestion;

      this.questionForm.patchValue({
        shuffleOptions: mc.shuffleOptions ?? false
      });

      const options: MultipleChoiceOption[] = mc.options ?? [];

      options.forEach(opt => {
        optionsFa.push(
          this.fb.group({
            text: [opt.text ?? '', Validators.required],
            isCorrect: [!!opt.isCorrect]
          })
        );
      });


    } else if (q.type === QuestionType.CodeCompletion) {
      const cc = q as CodeCompletionQuestion;

      this.questionForm.patchValue({
        codeSnippet: cc.codeSnippet ?? ''
      });

      (cc.acceptedAnswers ?? []).forEach((a: string) => acceptedAnswersFa.push(new FormControl(a)));
    }
  }

  private setFormArray(controlName: string, items: string[]) {
    const fa = this.questionForm.get(controlName) as FormArray;
    fa.clear();
    (items ?? []).forEach((i: string) => fa.push(new FormControl(i)));
  }

  private createOptionGroup(opt?: MultipleChoiceOption): FormGroup {
    return this.fb.group({
      text: [opt?.text ?? '', Validators.required],
      isCorrect: [opt?.isCorrect ?? false]
    });
  }

  get options() { return this.questionForm.get('options') as FormArray; }
  get correctAnswerIds() { return this.questionForm.get('correctAnswerIds') as FormArray; }
  get acceptedAnswers() { return this.questionForm.get('acceptedAnswers') as FormArray; }

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
  addAcceptedAnswer() { this.acceptedAnswers.push(this.fb.control('')); }
  removeAcceptedAnswer(i: number) { this.acceptedAnswers.removeAt(i); }

  saveQuestion() {
    const raw = this.questionForm.value;

    const tags =
      typeof raw.tags === 'string' && raw.tags.trim().length > 0
        ? raw.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
        : undefined;

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

        codeSnippet: raw.codeSnippet,
        acceptedAnswers: raw.acceptedAnswers || [],

        createdAt: this.question?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: this.question?.createdBy || 'admin'
      } as CodeCompletionQuestion;
    }

    console.log(q);
    this.save.emit(q);
  }
}