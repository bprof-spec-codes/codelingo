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

//toDo: question pages, filter 

export class AdminPanelComponent implements OnInit {
  questions$!: Observable<Question[]>;
  @Input() question!: Question;
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    //this.loadQuestions();
    this.loadMockQuestions()
  }
  loadQuestions():void{
    this.questions$ =this.adminService.getQuestions()
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
    ];

    this.questions$ = of(mockQuestions);
  }
  onQuestionUpdated(updated: Question) {
    this.adminService.updateQuestion(updated.id, updated)
  }
  onQuestionDelete(id: string) {
    this.adminService.deleteQuestion(id)
  }
  onQuestionCreated(created: Question) {
    this.adminService.createQuestion(created)
  }


}
