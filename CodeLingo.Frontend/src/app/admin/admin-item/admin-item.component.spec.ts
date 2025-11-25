import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminItemComponent } from './admin-item.component';
import { QuestionType, MultipleChoiceQuestion } from '../../models/question';

describe('AdminItemComponent', () => {
  let component: AdminItemComponent;
  let fixture: ComponentFixture<AdminItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminItemComponent);
    component = fixture.componentInstance;

    // >>> Itt adsz neki egy dummy @Input-ot
    const dummyQuestion: MultipleChoiceQuestion = {
      id: '1',
      type: QuestionType.MultipleChoice,
      language: 'TypeScript',
      difficulty: 'easy',
      title: 'Teszt kérdés',
      questionText: 'Mi ez?',
      explanation: 'magyarázat',
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

    component.question = dummyQuestion;

    fixture.detectChanges(); // most már nem undefined
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});