import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../../models/question';
import { AdminService } from '../../services/admin.service';

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
loadMockQuestions(): void {
  const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'radio',
      language: 'JavaScript',
      difficulty: 'easy',
      title: 'JavaScript típusok',
      questionText: 'Melyik típus nem létezik JavaScriptben?',
      explanation: 'A "character" típus nem létezik JavaScriptben.',
      tags: 'javascript,types',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'teszt-admin',
      isActive: true
    },
    {
      id: '2',
      type: 'radio',
      language: 'Python',
      difficulty: 'medium',
      title: 'Python lists',
      questionText: 'What is the result of len([1, [2, 3], 4])?',
      explanation: 'It returns 3 because there are three elements in the list.',
      tags: 'python,lists',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '3',
      type: 'radio',
      language: 'C',
      difficulty: 'hard',
      title: 'C változók',
      questionText: 'Mi történik, ha egy pointert felszabadítás után újra felhasználsz?',
      explanation: 'Ez "dangling pointer" hibát okoz, ami undefined behavior-hoz vezet.',
      tags: 'c,pointer,memory',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'teszt-admin',
      isActive: true
    },
    {
      id: '4',
      type: 'radio',
      language: 'Java',
      difficulty: 'medium',
      title: 'Java classes',
      questionText: 'Which keyword is used to inherit a class in Java?',
      explanation: 'The keyword "extends" is used for class inheritance in Java.',
      tags: 'java,oopp,inheritance',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system-admin',
      isActive: true
    },
    {
      id: '5',
      type: 'radio',
      language: 'HTML',
      difficulty: 'easy',
      title: 'HTML alapok',
      questionText: 'Melyik HTML elem jelöli a legnagyobb címsort?',
      explanation: 'Az <h1> jelöli a legnagyobb címsort.',
      tags: 'html,frontend,markup',
      metadata: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'frontend-admin',
      isActive: true
    }
  ];

  this.questions$ = of(mockQuestions);
}

}
