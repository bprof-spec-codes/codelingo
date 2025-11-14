import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question, MultipleChoiceQuestion, CodeCompletionQuestion, QuestionType } from '../../models/question';
import { AdminService } from '../../services/admin.service';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

  //toDo: Question type input should be radio 

export class AdminPanelComponent implements OnInit {
  questions$!: Observable<Question[]>;
  
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    //this.loadQuestions();
    this.loadMockQuestions()
  }
loadMockQuestions() {
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
      tags: 'javascript,types',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'teszt-admin',
      isActive: true,
      options: ['string', 'number', 'boolean', 'character'],
      correctAnswerIds: ['character'],
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
      tags: 'python,lists',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true,
      starterCode: '[1, [2, 3], 4]',
      correctAnswer: 'len([1, [2, 3], 4])',
      hints: ['Használd a len() függvényt'],
      constraints: ['Ne használj ciklust']
    } as CodeCompletionQuestion,

    // TrueFalse
    {
      id: '3',
      type: QuestionType.TrueFalse,
      language: 'C',
      difficulty: 'hard',
      title: 'C pointer',
      questionText: 'A pointer felszabadítás után használható újra?',
      explanation: 'Ez "dangling pointer" hibát okoz.',
      tags: 'c,pointer',
      metadata: 'False',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    },

    // FillInBlank
    {
      id: '4',
      type: QuestionType.FillInBlank,
      language: 'Java',
      difficulty: 'medium',
      title: 'Java class inheritance',
      questionText: 'Melyik kulcsszó használható öröklésre? ___',
      explanation: 'A "extends" kulcsszó használható.',
      tags: 'java,oopp',
      metadata: 'extends',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    },

    // CodeReview
    {
      id: '5',
      type: QuestionType.CodeReview,
      language: 'HTML',
      difficulty: 'easy',
      title: 'HTML alapok',
      questionText: 'Melyik elem jelöli a legnagyobb címsort?',
      explanation: 'Az <h1> jelöli a legnagyobb címsort.',
      tags: 'html,markup',
      metadata: '<h1>',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    }
  ];

  this.questions$ = of(mockQuestions);
}

}
