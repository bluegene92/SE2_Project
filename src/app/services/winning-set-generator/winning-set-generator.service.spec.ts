import { TestBed } from '@angular/core/testing';

import { WinningSetGeneratorService } from './winning-set-generator.service';

describe('WinningSetGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WinningSetGeneratorService = TestBed.get(WinningSetGeneratorService);
    expect(service).toBeTruthy();
  });
});
