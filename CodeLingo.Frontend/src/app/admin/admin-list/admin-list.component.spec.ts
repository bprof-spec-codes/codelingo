import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AdminListComponent } from './admin-list.component';
import { AdminService } from '../../services/admin.service';
import { QuestionType, MultipleChoiceQuestion } from '../../models/question';

describe('AdminListComponent', () => {
  let component: AdminListComponent;
  let fixture: ComponentFixture<AdminListComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj<AdminService>('AdminService', [
      'getLanguages',      // <<< EZ HIÁNYZOTT
      'getQuestions',
      'updateQuestion',
      'deleteQuestion',
      'createQuestion'
    ]);

    // ngOnInit-ben ne dőljön el:
    adminServiceSpy.getLanguages.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AdminListComponent],
      providers: [{ provide: AdminService, useValue: adminServiceSpy }],
      // ha a template-ben van <app-admin-item>, stb., ne zavarjon a tesztben
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminListComponent);
    component = fixture.componentInstance;

    // @Input beállítása
    component.questions$ = of([]);

    fixture.detectChanges(); // ngOnInit itt fut le, már létező getLanguages-szel
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit delete event on onItemDelete', () => {
    const spy = jasmine.createSpy('deleteSpy');
    const id = 'q-123';

    component.delete.subscribe(spy);

    component.onItemDelete(id);

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('should emit questionUpdated event on onItemUpdated', () => {
    const spy = jasmine.createSpy('updateSpy');

    const q: MultipleChoiceQuestion = {
      id: 'q-1',
      type: QuestionType.MultipleChoice,
      language: 'TS',
      difficulty: 'easy',
      title: 'Teszt kérdés',
      questionText: 'Szöveg',
      explanation: 'exp',
      tags: [],
      metadata: { category: '', topic: '', source: '' },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test',
      isActive: true,
      options: [
        { text: 'A', isCorrect: true },
        { text: 'B', isCorrect: false }
      ],
      allowMultipleSelection: false,
      shuffleOptions: false
    };

    component.questionUpdated.subscribe(spy);

    component.onItemUpdated(q);

    expect(spy).toHaveBeenCalledWith(q);
  });
});