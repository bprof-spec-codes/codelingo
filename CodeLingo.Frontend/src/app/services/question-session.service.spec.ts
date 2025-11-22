import { TestBed } from '@angular/core/testing';

import { QuestionSessionService } from './question-session.service';

describe('QuestionSessionService', () => {
  let service: QuestionSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
