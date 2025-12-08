import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CodeCompletionQuestion } from '../../models/code-completion-question';

@Component({
    selector: 'app-code-completion-question',
    standalone: false,
    templateUrl: './code-completion-question.component.html',
    styleUrls: ['./code-completion-question.component.scss']
})
export class CodeCompletionQuestionComponent implements OnInit, OnChanges {
    @Input() question!: CodeCompletionQuestion;
    @Input() isSubmitted = false;
    @Output() answerSubmitted = new EventEmitter<string>();

    answer: string = '';
    preSnippet: string = '';
    postSnippet: string = '';

    constructor() { }

    ngOnInit(): void {
        this.parseSnippet();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question']) {
            this.answer = '';
            this.parseSnippet();
        }
    }

    private parseSnippet(): void {
        if (this.question?.codeSnippet) {
            // Split by 3 or more underscores
            const parts = this.question.codeSnippet.split(/_{3,}/);
            this.preSnippet = parts[0] || '';
            this.postSnippet = parts[1] || '';
        }
    }

    submitAnswer(): void {
        if (this.isSubmitted) return;
        this.answerSubmitted.emit(this.answer);
    }
}
