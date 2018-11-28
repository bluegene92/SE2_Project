import { TestBed } from '@angular/core/testing';

import { BoardManagerService } from './board-manager.service';

describe('BoardManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardManagerService = TestBed.get(BoardManagerService);
    expect(service).toBeTruthy();
  });
});
