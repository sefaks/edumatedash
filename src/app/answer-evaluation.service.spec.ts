import { TestBed } from '@angular/core/testing';

import { AnswerEvaluationService } from './answer-evaluation.service';

describe('AnswerEvaluationService', () => {
  let service: AnswerEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
