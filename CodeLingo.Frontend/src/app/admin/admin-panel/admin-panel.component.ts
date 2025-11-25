import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Question, MultipleChoiceQuestion, CodeCompletionQuestion, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})


export class AdminPanelComponent implements OnInit {
  questions$!: Observable<Question[]>;
  @Input() question!: Question;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.loadQuestions();
  }
  loadQuestions(): void {
    this.questions$ = this.adminService.getQuestions()
  }
  /*loadMockQuestions() {
const mockQuestions: Question[] = [
  // MultipleChoice
  {
    id: '1',
    type: QuestionType.MultipleChoice,
    language: 'JavaScript',
    difficulty: 'easy',
    title: 'JS típusok',
    questionText: 'Melyik típus nem létezik JavaScriptben?',
    explanation: 'A "character" típus nem létezik JavaScriptben.',
    tags: ['javascript', 'types'],
    metadata: {
      category: 'language-basics',
      topic: 'types',
      source: 'internal'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'teszt-admin',
    isActive: true,
    options: [
      { text: 'string',    isCorrect: false },
      { text: 'number',    isCorrect: false },
      { text: 'boolean',   isCorrect: false },
      { text: 'character', isCorrect: true }
    ],
    allowMultipleSelection: false,
    shuffleOptions: true
  } as MultipleChoiceQuestion,

  // CodeCompletion
  {
    id: '2',
    type: QuestionType.CodeCompletion,
    language: 'Python',
    difficulty: 'medium',
    title: 'Python lists',
    questionText: 'Írd ki a hiányzó kódot, hogy a list hosszát kapd meg!',
    explanation: 'A len() függvény adja vissza a lista hosszát.',
    tags: ['python', 'lists'],
    metadata: {
      category: 'language-basics',
      topic: 'lists',
      source: 'internal'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
    isActive: true,
    starterCode: '[1, [2, 3], 4]',
    correctAnswer: 'len([1, [2, 3], 4])',
    hints: ['Használd a len() függvényt'],
    constraints: ['Ne használj ciklust']
  } as CodeCompletionQuestion,

  // Új MultipleChoice metadata-val
  {
    id: '3',
    type: QuestionType.MultipleChoice,
    language: 'TypeScript',
    difficulty: 'hard',
    title: 'Union típusok',
    questionText: 'Melyik példa mutat be union típust TypeScriptben?',
    explanation: 'A | operátor jelöli az union típust TypeScriptben.',
    tags: ['typescript', 'types', 'union'],
    metadata: {
      category: 'language-advanced',
      topic: 'type-system',
      source: 'internal'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'senior-admin',
    isActive: true,
    options: [
      { text: 'let x: number[] = [1, 2];', isCorrect: false },
      { text: 'let x: number | string;',   isCorrect: true },
      { text: 'type X = { a: number };',   isCorrect: false },
      { text: 'interface X { a: number }', isCorrect: false }
    ],
    allowMultipleSelection: false,
    shuffleOptions: true
  } as MultipleChoiceQuestion
];

    this.questions$ = of(mockQuestions);
  }
    */
  onQuestionUpdated(updated: Question) {
    this.adminService.updateQuestion(updated.id, updated).subscribe({
      next: () => {
        this.loadQuestions(); // lista újratöltése
      },
      error: err => {
        console.error('Update failed', err);
      }
    });
  }
  onQuestionDelete(id: string) {
    this.adminService.deleteQuestion(id).subscribe({
      next: () => {
        this.loadQuestions(); // törlés után újratöltöd
      },
      error: err => {
        console.error('Delete failed', err);
      }
    });
  }
 onQuestionCreated(created: Question) {
    this.adminService.createQuestion(created).subscribe({
      next: () => {
        this.loadQuestions(); // létrehozás után is frissítesz
      },
      error: err => {
        console.error('Create failed', err);
      }
    });
  }


}
