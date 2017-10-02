import { TestBed, inject } from '@angular/core/testing';

import { TruffleService } from './truffle.service';

describe('TruffleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TruffleService]
    });
  });

  it('should be created', inject([TruffleService], (service: TruffleService) => {
    expect(service).toBeTruthy();
  }));
});
