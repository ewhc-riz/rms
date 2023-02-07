import { TestBed } from '@angular/core/testing';

import { FranchisingService } from './franchising.service';

describe('FranchisingService', () => {
  let service: FranchisingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FranchisingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
