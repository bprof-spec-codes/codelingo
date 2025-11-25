import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';          
import { of } from 'rxjs';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminService } from '../../services/admin.service';
import { Question } from '../../models/question';
import { CountUpModule } from 'ngx-countup';                

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj<AdminService>(
      'AdminService',
      ['getQuestions', 'updateQuestion', 'deleteQuestion', 'createQuestion']
    );

    await TestBed.configureTestingModule({
      declarations: [AdminPanelComponent],
      imports: [CountUpModule],                                  
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]                          // <<< fix for child
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load mock questions on init', (done) => {
    component.ngOnInit();

    component.questions$.subscribe((questions: Question[]) => {
      expect(questions.length).toBe(3);
      done();
    });
  });

  it('should call AdminService.updateQuestion on onQuestionUpdated', () => {
    const q = { id: '42' } as any as Question;

    component.onQuestionUpdated(q);

    expect(adminServiceSpy.updateQuestion).toHaveBeenCalledWith('42', q);
  });

  it('should call AdminService.deleteQuestion and createQuestion', () => {
    const deleteId = '99';
    const created = { id: 'abc' } as any as Question;

    component.onQuestionDelete(deleteId);
    component.onQuestionCreated(created);

    expect(adminServiceSpy.deleteQuestion).toHaveBeenCalledWith(deleteId);
    expect(adminServiceSpy.createQuestion).toHaveBeenCalledWith(created);
  });
});