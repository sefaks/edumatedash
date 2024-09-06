import { TestBed } from '@angular/core/testing';

import { T3serviceService } from './t3service.service';

describe('T3serviceService', () => {
  let service: T3serviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T3serviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
