import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { QuestionType, DifficultyLevel, ProgrammingLanguage } from '../../models/base-question';
import { CodeCompletionQuestion } from '../../models/code-completion-question';

declare const monaco: any;

@Component({
    selector: 'app-code-question-editor',
    standalone: false,
    templateUrl: './code-question-editor.component.html',
    styleUrls: ['./code-question-editor.component.scss']
})
export class CodeQuestionEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    questionForm: FormGroup;

    @ViewChild('starterCodeEditor') starterCodeEditorContainer!: ElementRef;
    @ViewChild('solutionCodeEditor') solutionCodeEditorContainer!: ElementRef;

    private starterEditor!: any;
    private solutionEditor!: any;

    languages: ProgrammingLanguage[] = ['csharp', 'javascript', 'python', 'java', 'cpp', 'go'];
    difficulties: DifficultyLevel[] = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD];

    constructor(private fb: FormBuilder) {
        this.questionForm = this.fb.group({
            title: ['', Validators.required],
            questionText: ['', Validators.required],
            explanation: [''],
            language: ['javascript', Validators.required],
            difficulty: [DifficultyLevel.EASY, Validators.required],
            tags: [''],
            starterCode: [''],
            solutionCode: [''],
            testCases: this.fb.array([]),
            constraints: this.fb.group({
                maxLines: [50],
                maxCharacters: [1000],
                forbiddenKeywords: ['']
            }),
            hints: this.fb.array([])
        });
    }

    ngOnInit(): void {
        // Initialize with one test case
        this.addTestCase();
    }

    ngAfterViewInit(): void {
        this.loadMonaco();
    }

    ngOnDestroy(): void {
        if (this.starterEditor) {
            this.starterEditor.dispose();
        }
        if (this.solutionEditor) {
            this.solutionEditor.dispose();
        }
    }

    private loadMonaco(): void {
        if ((window as any).monaco) {
            this.initMonaco();
            return;
        }

        const script = document.createElement('script');
        script.src = 'assets/monaco/vs/loader.js';
        script.onload = () => {
            const require = (window as any).require;
            if (require) {
                require.config({ paths: { 'vs': 'assets/monaco/vs' } });
                require(['vs/editor/editor.main'], () => {
                    this.initMonaco();
                });
            }
        };
        document.body.appendChild(script);
    }

    private initMonaco(): void {
        if (this.starterCodeEditorContainer) {
            this.starterEditor = monaco.editor.create(this.starterCodeEditorContainer.nativeElement, {
                value: '// Write your starter code here\n',
                language: this.questionForm.get('language')?.value || 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false }
            });

            this.starterEditor.onDidChangeModelContent(() => {
                this.questionForm.patchValue({ starterCode: this.starterEditor.getValue() });
            });
        }

        if (this.solutionCodeEditorContainer) {
            this.solutionEditor = monaco.editor.create(this.solutionCodeEditorContainer.nativeElement, {
                value: '// Write the solution here\n',
                language: this.questionForm.get('language')?.value || 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false }
            });

            this.solutionEditor.onDidChangeModelContent(() => {
                this.questionForm.patchValue({ solutionCode: this.solutionEditor.getValue() });
            });
        }

        // Update language when form changes
        this.questionForm.get('language')?.valueChanges.subscribe(lang => {
            if (this.starterEditor) {
                monaco.editor.setModelLanguage(this.starterEditor.getModel()!, lang);
            }
            if (this.solutionEditor) {
                monaco.editor.setModelLanguage(this.solutionEditor.getModel()!, lang);
            }
        });
    }

    get testCases(): FormArray {
        return this.questionForm.get('testCases') as FormArray;
    }

    addTestCase(): void {
        const testCaseGroup = this.fb.group({
            input: ['', Validators.required],
            expectedOutput: ['', Validators.required],
            isHidden: [false]
        });
        this.testCases.push(testCaseGroup);
    }

    removeTestCase(index: number): void {
        this.testCases.removeAt(index);
    }

    get hints(): FormArray {
        return this.questionForm.get('hints') as FormArray;
    }

    addHint(): void {
        this.hints.push(this.fb.control(''));
    }

    removeHint(index: number): void {
        this.hints.removeAt(index);
    }

    onSubmit(): void {
        if (this.questionForm.valid) {
            const formValue = this.questionForm.value;

            // Process tags and forbiddenKeywords from string to array if needed
            // For now assuming they are comma separated strings in the form
            const tags = typeof formValue.tags === 'string' ? formValue.tags.split(',').map((t: string) => t.trim()) : formValue.tags;
            const forbiddenKeywords = typeof formValue.constraints.forbiddenKeywords === 'string'
                ? formValue.constraints.forbiddenKeywords.split(',').map((k: string) => k.trim())
                : formValue.constraints.forbiddenKeywords;

            const question: CodeCompletionQuestion = {
                id: crypto.randomUUID(), // Temporary ID generation
                type: QuestionType.CODE_COMPLETION,
                ...formValue,
                tags,
                constraints: {
                    ...formValue.constraints,
                    forbiddenKeywords
                },
                metadata: {
                    version: 1,
                    estimatedTimeSeconds: 0,
                    pointValue: 0,
                    usageCount: 0,
                    averageCorrectRate: 0
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'current-user', // Placeholder
                isActive: true
            };

            console.log('Submitting Question:', question);
            // Here you would call a service to save the question
        } else {
            this.questionForm.markAllAsTouched();
        }
    }
}
