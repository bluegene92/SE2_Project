import { TestBed } from '@angular/core/testing';

import { AlphabetaService } from './alphabeta.service';

describe('AlphabetaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlphabetaService = TestBed.get(AlphabetaService);
    expect(service).toBeTruthy();
  });
});
